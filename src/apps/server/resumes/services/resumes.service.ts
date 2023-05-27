import { ApiService } from '@modules/api/api.service';
import { SpellCheckResult } from '@modules/api/api.type';
import { ResumeRepository } from '@modules/database/repositories/resume.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { GetResumeRequestQueryDto, GetResumeResponseDto } from '🔥apps/server/resumes/dtos/get-resume.dto';
import { PatchResumeRequestDto } from '🔥apps/server/resumes/dtos/patch-resume.dto';
import { PostResumeRequestBodyDto, PostResumeResponseDto } from '🔥apps/server/resumes/dtos/post-resume.dto';
import { PostSpellCheckRequestBodyDto } from '🔥apps/server/resumes/dtos/post-spell-check-request.body.dto';

@Injectable()
export class ResumesService {
  constructor(private readonly resumesRepository: ResumeRepository, private readonly apiService: ApiService) {}

  public async getAllResumes(userId: number, query?: GetResumeRequestQueryDto): Promise<GetResumeResponseDto[]> {
    const resumes = await this.resumesRepository.findMany({
      where: { userId },
      include: { Question: query.question },
      orderBy: { updatedAt: 'desc' },
    });

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

  async updateResumeFolder({ body, resumeId, userId }: { body: PatchResumeRequestDto; resumeId: number; userId: number }): Promise<void> {
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
