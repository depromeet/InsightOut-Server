import { Injectable } from '@nestjs/common';
import { Resume } from '@prisma/client';
import { ResumeRepository } from '@modules/database/repositories/resume.repository';
import {
  PostResumeRequestBodyDto,
  PostResumeResponseDto,
} from '../dtos/post-resume.dto';
import { GetResumeRequestQueryDto } from '@apps/server/resumes/dtos/get-resume-query.dto';

@Injectable()
export class ResumesService {
  constructor(private readonly resumesRepository: ResumeRepository) {}

  async getAllResumes(
    userId: number,
    query?: GetResumeRequestQueryDto,
  ): Promise<Resume[]> {
    const resumes = await this.resumesRepository.findMany({
      where: { userId },
      include: { Question: query.question },
    });
    if (query && query.filter) {
      return resumes.filter((resume) => resume.title === query.filter);
    }

    return resumes;
  }

  async createResumeFolder(
    body: PostResumeRequestBodyDto,
    userId: number,
  ): Promise<PostResumeResponseDto> {
    const { title } = body;
    const resume = await this.resumesRepository.create({
      data: { title, userId },
    });

    // Entity -> DTO
    const resumeResponseDto = new PostResumeResponseDto(resume);
    return resumeResponseDto;
  }
}
