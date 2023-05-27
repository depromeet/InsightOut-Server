import { Injectable, NotFoundException } from '@nestjs/common';
import { QuestionRepository } from '@modules/database/repositories/question.repository';
import { ResumeRepository } from '@modules/database/repositories/resume.repository';
import { PostQuestionResponseDto } from '../dtos/post-question.dto';
import { PatchQuestionRequestBodyDto } from '@apps/server/resumes/dtos/patch-question-request.dto';

@Injectable()
export class QuestionsService {
  constructor(
    private readonly resumeRepository: ResumeRepository,
    private readonly questionRepository: QuestionRepository,
  ) {}

  async createOneQuestion(
    userId: number,
    resumeId: number,
  ): Promise<PostQuestionResponseDto> {
    const resume = await this.resumeRepository.findFirst({
      where: { id: resumeId, User: { id: userId } },
      include: { Question: true },
    });

    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    const questionLength = resume['Question'].length;

    const question = await this.questionRepository.create({
      data: { resumeId, title: `${questionLength + 1}번 문항` },
    });

    const questionReponseDto = new PostQuestionResponseDto(question);
    return questionReponseDto;
  }

  async updateOneQuestion(
    body: PatchQuestionRequestBodyDto,
    questionId: number,
    userId: number,
  ): Promise<void> {
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
}
