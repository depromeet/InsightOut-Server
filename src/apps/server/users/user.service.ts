import { Injectable } from '@nestjs/common';
import { FeedbackRepository } from '📚libs/modules/database/repositories/feedback.repository';
import { UserRepository } from '📚libs/modules/database/repositories/user.repository';
import { PostSendFeedbackRequestBodyDto } from '🔥apps/server/users/dtos/post-feedback.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository, private readonly feedbackRepository: FeedbackRepository) {}

  /**
   * 유저가 작성한 피드백을 Feedback 테이블에 저장합니다.
   *
   * @param body 유저가 작성한 피드백이 담긴 객체입니다.
   */
  async sendFeedback(body: PostSendFeedbackRequestBodyDto): Promise<void> {
    const { contents } = body;
    await this.feedbackRepository.create({
      data: { contents },
    });
  }
}
