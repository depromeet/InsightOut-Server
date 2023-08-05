import { Injectable, NotFoundException } from '@nestjs/common';
import { QuestionRepository } from '📚libs/modules/database/repositories/question.repository';
import { ResumeRepository } from '📚libs/modules/database/repositories/resume.repository';
import { PostQuestionResponseDto } from '../dtos/questions/req/postQuestion.dto';
import { SpellCheckResult } from '📚libs/modules/api/api.type';
import { ApiService } from '📚libs/modules/api/api.service';
import { PatchQuestionRequestBodyDto, PatchQuestionResponseDto } from '🔥apps/server/resumes/dtos/questions/req/patchQuestion.dto';
import { PostSpellCheckRequestBodyDto } from '🔥apps/server/resumes/dtos/questions/req/postSpellCheck.dto';
import { GetOneQuestionResponseDto } from '🔥apps/server/resumes/dtos/questions/req/getQuestion.dto';

@Injectable()
export class QuestionsService {
  constructor(
    private readonly resumeRepository: ResumeRepository,
    private readonly questionRepository: QuestionRepository,
    private readonly apiService: ApiService,
  ) {}

  /**
   * 자기소개서의 문항을 한 개 생성합니다.
   *
   * @param userId 자기소개서 문항(Question)을 작성한 userId 입니다.
   * @param resumeId 자기소개서의 id 입니다. 자기소개서의 문항이 위치할 곳이므로 id 값이 필요합니다.
   */
  async createOneQuestion(userId: number, resumeId: number): Promise<PostQuestionResponseDto> {
    const resume = await this.resumeRepository.findFirst({
      where: { id: resumeId, User: { id: userId } },
    });

    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    const question = await this.questionRepository.create({
      data: { resumeId },
    });

    const questionReponseDto = new PostQuestionResponseDto(question);
    return questionReponseDto;
  }

  public async spellCheck({ body }: { body: PostSpellCheckRequestBodyDto }): Promise<SpellCheckResult[][]> {
    const { sentence } = body;
    const checkedSpellByDAUM = await this.apiService.spellCheckByDaum(sentence);

    return checkedSpellByDAUM;
  }

  async updateOneQuestion(body: PatchQuestionRequestBodyDto, questionId: number, userId: number): Promise<PatchQuestionResponseDto> {
    const { title, answer } = body;

    const question = await this.questionRepository.findFirst({
      where: { id: questionId, Resume: { User: { id: userId } } },
    });

    if (!question) {
      throw new NotFoundException('Resume question not found');
    }

    if (title || answer) {
      return new PatchQuestionResponseDto(
        await this.questionRepository.update({
          data: { title, answer },
          where: { id: questionId },
          select: { updatedAt: true },
        }),
      );
    }
  }

  async deleteQuestion({ questionId, userId }: { questionId: number; userId: number }): Promise<void> {
    const question = await this.questionRepository.findFirst({
      where: { id: questionId, Resume: { userId } },
    });

    if (!question) {
      throw new NotFoundException('Resume question not found');
    }

    await this.questionRepository.delete({
      where: { id: questionId },
    });
  }

  /**
   * 자기소개서 문항을 한 개 조회합니다.
   *
   * 유저 id(userId)와 자기소개서 문항 id(questionId)를 통해서 자기소개서 문항을 가져옵니다.
   * 자기소개서 문항은 제목과 답안이 존재하지 않을 수 있으므로, optional property로 dto를 구성합니다.
   *
   * @param userId 유저 id
   * @param questionId 자기소개서 문항 id
   * @returns 특정 자기소개서 문항 1개
   */
  async getOneQuestion(userId: number, questionId: number): Promise<GetOneQuestionResponseDto> {
    const question = await this.questionRepository.findFirst({
      where: { id: questionId, Resume: { userId } },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    const questionResponseDto = new GetOneQuestionResponseDto(question);
    return questionResponseDto;
  }
}
