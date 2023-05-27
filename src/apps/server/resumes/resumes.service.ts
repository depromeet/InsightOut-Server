import { Injectable, NotFoundException } from '@nestjs/common';
import { Resume } from '@prisma/client';
import { PostResumeRequestBodyDto, PostResumeResponseDto } from './dtos/post-resume.dto';
import { PatchResumeRequestDto } from './dtos/patch-resume.dto';
import { ResumeRepository } from '@modules/database/repositories/resume.repository';

@Injectable()
export class ResumesService {
  constructor(private readonly resumesRepository: ResumeRepository) {}

  async getAllResumes(userId: number): Promise<Resume[]> {
    const resumes = await this.resumesRepository.findMany({
      where: { userId },
    });

    return resumes;
  }

  async createResumeFolder(body: PostResumeRequestBodyDto, userId: number): Promise<PostResumeResponseDto> {
    const { title } = body;
    const resume = await this.resumesRepository.create({
      data: { title, userId },
    });

    // Entity -> DTO
    const resumeResponseDto = new PostResumeResponseDto(resume);
    return resumeResponseDto;
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
