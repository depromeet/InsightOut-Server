import { ApiService } from '📚libs/modules/api/api.service';
import { SpellCheckResult } from '📚libs/modules/api/api.type';
import { ResumeRepository } from '📚libs/modules/database/repositories/resume.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { GetResumeRequestQueryDto, GetResumeResponseDto } from '🔥apps/server/resumes/dtos/get-resume.dto';
import { PatchResumeRequestDto } from '🔥apps/server/resumes/dtos/patch-resume.dto';
import { PostResumeRequestBodyDto, PostResumeResponseDto } from '🔥apps/server/resumes/dtos/post-resume.dto';
import { PostSpellCheckRequestBodyDto } from '🔥apps/server/resumes/dtos/post-spell-check-request.body.dto';
import { Question, Resume } from '@prisma/client';

@Injectable()
export class ResumesService {
  constructor(private readonly resumesRepository: ResumeRepository, private readonly apiService: ApiService) {}

  /**
   * 유저가 작성한 모든 자기소개서를 가져옵니다. 문항의 답안(answer)은 payload가 크기 때문에 option으로 선택해 가져옵니다.
   *
   * @param userId 유저 id 입니다.
   * @param query 문항의 답안(answer)를 조회할지에 대한 여부입니다.
   *
   * @returns 유저가 작성한 자기소개서를 문항과 함께 가져옵니다.
   */
  public async getAllResumes(userId: number, query?: GetResumeRequestQueryDto): Promise<GetResumeResponseDto[]> {
    const { answer } = query;

    // 자기소개서와 문항을 함께 가져옵니다.
    const resumes = (await this.resumesRepository.findMany({
      where: { userId },
      include: { Question: { select: { title: true, answer, updatedAt: true } } }, // 문항의 제목은 모든 화면에서 사용하기 때문에 반드시 true로 지정합니다.
      orderBy: { updatedAt: 'desc' }, // 기본적으로 DB에서 순서가 바뀌기 때문에 정렬하여 고정적으로 데이터를 반환합니다.
    })) as (Resume & { Question: Question[] })[]; // Resume 테이블과 Question 타입을 인터섹션한 후에 타입 단언을 통해 해결합니다.

    return resumes.map((resume) => new GetResumeResponseDto(resume));
  }

  public async createResumeFolder(body: PostResumeRequestBodyDto, userId: number): Promise<PostResumeResponseDto> {
    const { title } = body;
    const resume = await this.resumesRepository.create({
      data: { title, userId },
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
