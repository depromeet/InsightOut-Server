import { Injectable, NotFoundException } from '@nestjs/common';
import { QuestionRepository } from '📚libs/modules/database/repositories/question.repository';
import { ResumeRepository } from '📚libs/modules/database/repositories/resume.repository';
import { PostQuestionResponseDto } from '../dtos/post-question.dto';
import { PatchQuestionRequestBodyDto } from '🔥apps/server/resumes/dtos/patch-question-request.dto';

@Injectable()
export class QuestionsService {
  constructor(private readonly resumeRepository: ResumeRepository, private readonly questionRepository: QuestionRepository) {}

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

  async updateOneQuestion(body: PatchQuestionRequestBodyDto, questionId: number, userId: number): Promise<void> {
    const { title, answer } = body;

    const question = await this.questionRepository.findFirst({
      where: { id: questionId, Resume: { User: { id: userId } } },
    });

    if (!question) {
      throw new NotFoundException('Resume question not found');
    }

    if (title || answer) {
      await this.questionRepository.update({
        data: { title, answer },
        where: { id: questionId },
      });
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
}
