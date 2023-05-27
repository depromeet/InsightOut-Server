import { Injectable } from '@nestjs/common';
import { Resume } from '@prisma/client';
import { ResumesRepository } from '../../../modules/database/repositories/resume.repository';
import { PostSpellCheckRequestBodyDto } from './dtos/post-spell-check-request.body.dto';
import { ApiService } from '../../../modules/api/api.service';
import { SpellCheckResult } from '../../../modules/api/api.type';

@Injectable()
export class ResumesService {
  constructor(
    private readonly resumesRepository: ResumesRepository,
    private readonly apiService: ApiService,
  ) {}

  public async getAllResumes(userId: number): Promise<Resume[]> {
    const resumes = await this.resumesRepository.findMany({
      where: { userId },
    });

    return resumes;
  }

  public async spellCheck(
    body: PostSpellCheckRequestBodyDto,
  ): Promise<SpellCheckResult[][]> {
    const { sentence } = body;
    const checkedSpellByDAUM = await this.apiService.spellCheckByDaum(sentence);

    return checkedSpellByDAUM;
  }
}
