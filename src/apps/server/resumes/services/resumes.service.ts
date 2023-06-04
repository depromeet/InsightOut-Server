import { ApiService } from '📚libs/modules/api/api.service';
import { SpellCheckResult } from '📚libs/modules/api/api.type';
import { ResumeRepository } from '📚libs/modules/database/repositories/resume.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { GetAllResumeRequestQueryDto, GetOneResumeResponseDto } from '🔥apps/server/resumes/dtos/get-resume.dto';
import { PatchResumeRequestDto } from '🔥apps/server/resumes/dtos/patch-resume.dto';
import { PostResumeResponseDto } from '🔥apps/server/resumes/dtos/post-resume.dto';
import { PostSpellCheckRequestBodyDto } from '🔥apps/server/resumes/dtos/post-spell-check-request.body.dto';
import { Question, Resume } from '@prisma/client';
import { PrismaService } from '📚libs/modules/database/prisma.service';

@Injectable()
export class ResumesService {
  constructor(
    private readonly resumesRepository: ResumeRepository,
    private readonly apiService: ApiService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * 유저가 작성한 모든 자기소개서를 가져옵니다. 문항의 답안(answer)은 payload가 크기 때문에 option으로 선택해 가져옵니다.
   *
   * @param userId 유저 id 입니다.
   * @param query 문항의 답안(answer)를 조회할지에 대한 여부입니다.
   *
   * @returns 유저가 작성한 자기소개서를 문항과 함께 가져옵니다.
   */
  public async getAllResumes(userId: number, query?: GetAllResumeRequestQueryDto): Promise<GetOneResumeResponseDto[]> {
    const { answer } = query;

    // 자기소개서와 문항을 함께 가져옵니다.
    const resumes = await this.resumesRepository.findMany({
      where: { userId },
      include: { Question: { select: { id: true, title: true, answer, updatedAt: true }, orderBy: { createdAt: 'desc' } } }, // 문항의 제목은 모든 화면에서 사용하기 때문에 반드시 true로 지정합니다.
      orderBy: { createdAt: 'desc' }, // 기본적으로 DB에서 순서가 바뀌기 때문에 정렬하여 고정적으로 데이터를 반환합니다.
    }); // Resume 테이블과 Question 타입을 인터섹션한 후에 타입 단언을 통해 해결합니다.

    return resumes.map((resume) => new GetOneResumeResponseDto(resume as Resume & { Question: Question[] }));
  }

  /**
   * 한 개의 자기소개서를 조회합니다.
   *
   * userId와 resumeId로 특정 자기소개서를 한 개 가져오며, 자기소개서에 해당하는 문항들도 가져옵니다.
   * 기본적으로 화면 단에서 생성일자 기준 내림차순(최신순)으로 정렬됩니다.
   *
   * @param userId 유저 id
   * @param resumeId 자기소개서 id
   * @returns 자기소개서와 자기소개서 문항을 가져옵니다.
   */
  public async getOneResume(userId: number, resumeId: number): Promise<GetOneResumeResponseDto> {
    const resume = await this.resumesRepository.findFirst({
      where: { userId, id: resumeId },
      include: { Question: { select: { id: true, title: true, answer: true, updatedAt: true }, orderBy: { createdAt: 'desc' } } }, // 자기소개서 문항을 left join, select 하며, 생성일자 기준 내림차순으로 모두 가져옵니다.
    });

    // Entity -> DTO
    const getOneResumeDto = new GetOneResumeResponseDto(resume as Resume & { Question: Question[] });
    return getOneResumeDto;
  }

  /**
   * 자기소개서를 생성합니다.
   * 자기소개서 추가 버튼을 눌렀을 때, 빈 자기소개서 폴더(실제로 폴더는 아님)가 만들어집니다.
   *
   * 기본값은 "새 자기소개서" 입니다.
   *
   * @param userId 유저 id
   * @returns resumeId, title, createdAt, updatedAt
   */
  public async createResumeFolder(userId: number): Promise<PostResumeResponseDto> {
    const resume = await this.prisma.resume.create({
      data: { userId },
    });

    // Entity -> DTO
    const resumeResponseDto = new PostResumeResponseDto(resume);
    return resumeResponseDto;
  }

  public async spellCheck(body: PostSpellCheckRequestBodyDto): Promise<SpellCheckResult[][]> {
    const { sentence } = body;
    const checkedSpellByDAUM = await this.apiService.spellCheckByDaum(sentence);

    return checkedSpellByDAUM;
  }

  async deleteResume({ resumeId, userId }: { resumeId: number; userId: number }): Promise<void> {
    const resume = await this.resumesRepository.findFirst({
      where: { id: resumeId, userId },
    });

    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    await this.resumesRepository.delete({
      where: { id: resumeId },
    });
  }

  async updateResumeFolder(body: PatchResumeRequestDto, resumeId: number, userId: number): Promise<void> {
    const { title } = body;

    const resume = await this.resumesRepository.findFirst({
      where: { id: resumeId, userId },
    });

    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    if (title) {
      await this.resumesRepository.update({
        data: { title },
        where: { id: resumeId },
      });
    }
  }
}
