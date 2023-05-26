import { Injectable } from '@nestjs/common';
import { ResumeRepository } from '@modules/database/repositories/resume.repository';
import {
  PostResumeRequestBodyDto,
  PostResumeResponseDto,
} from '../dtos/post-resume.dto';
import {
  GetResumeRequestQueryDto,
  GetResumeResponseDto,
} from '@apps/server/resumes/dtos/get-resume.dto';

@Injectable()
export class ResumesService {
  constructor(private readonly resumesRepository: ResumeRepository) {}

  async getAllResumes(
    userId: number,
    query?: GetResumeRequestQueryDto,
  ): Promise<GetResumeResponseDto[]> {
    const resumes = await this.resumesRepository.findMany({
      where: { userId },
      include: { Question: query.question },
      orderBy: { updatedAt: 'desc' },
    });
    if (query && query.filter) {
      return resumes
        .filter((resume) => resume.title === query.filter)
        .map((resume) => new GetResumeResponseDto(resume));
    }

    return resumes.map((resume) => new GetResumeResponseDto(resume));
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
