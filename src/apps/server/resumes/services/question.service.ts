import { Injectable, NotFoundException } from '@nestjs/common';
import { QuestionRepository } from '@modules/database/repositories/question.repository';
import { ResumeRepository } from '@modules/database/repositories/resume.repository';
import { PostQuestionResponseDto } from '../dtos/post-question.dto';

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
}
