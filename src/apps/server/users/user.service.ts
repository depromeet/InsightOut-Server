import { BadRequestException, Injectable } from '@nestjs/common';
import { FeedbackRepository } from '📚libs/modules/database/repositories/feedback.repository';
import { UserRepository } from '📚libs/modules/database/repositories/user.repository';
import { GetUserResponseDto } from '🔥apps/server/users/dtos/get-user.dto';
import { PatchUserInfoRequestBodyDto } from '🔥apps/server/users/dtos/patch-user-info.dto';
import { PostSendFeedbackRequestBodyDto } from '🔥apps/server/users/dtos/post-feedback.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository, private readonly feedbackRepository: FeedbackRepository) {}

  /**
   * ### 유저 정보를 가져오는 API
   *
   * 토큰에 있는 유저 아이디를 사용하여 유저의 정보를 조회합니다.
   * nickname, eamil, UserInfo의 imageUrl은 마이페이지를 호버했을 때 사용하기 때문에 필요합니다.
   *
   * @param userId 유저 아이디
   * @returns nickname, email, imageUrl을 DTO로 변환하여 전달합니다.
   */
  async getOneUser(userId: number) {
    const userInfo = await this.userRepository.getOneUser(userId);

    // Entity -> DTO
    const getOneUserResponseDto = new GetUserResponseDto(userInfo);

    return getOneUserResponseDto;
  }

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

  async updateUserInfo(userId: number, body: PatchUserInfoRequestBodyDto): Promise<void> {
    if (!Object.keys(body).length) {
      throw new BadRequestException('Please input information to be updated');
    }

    await this.userRepository.update({
      data: { nickname: body.nickname, UserInfo: { update: { field: body.field } } },
      where: { id: userId },
    });
  }
}
