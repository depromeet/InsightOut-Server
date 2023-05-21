import { Injectable } from '@nestjs/common';
import { Resume } from '@prisma/client';
import { ResumesRepository } from '../../../modules/database/repositories/resume.repository';

@Injectable()
export class ResumesService {
  constructor(private readonly resumesRepository: ResumesRepository) {}

  async getAllResumes(userId: number): Promise<Resume[]> {
    const resumes = await this.resumesRepository.findMany({
      where: { userId },
    });

    return resumes;
  }
}
