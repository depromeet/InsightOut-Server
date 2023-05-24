import { Injectable } from '@nestjs/common';
import { Resume } from '@prisma/client';
import { ResumesRepository } from '../../../modules/database/repositories/resume.repository';
import {
  PostResumeRequestBodyDto,
  PostResumeResponseDto,
} from './dtos/post-resume.dto';

@Injectable()
export class ResumesService {
  constructor(private readonly resumesRepository: ResumesRepository) {}

  async getAllResumes(userId: number): Promise<Resume[]> {
    const resumes = await this.resumesRepository.findMany({
      where: { userId },
    });

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
