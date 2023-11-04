import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { PatchUserInfoBodyRequestDto } from '@apps/server/users/dtos/req/patchUserInfo.dto';
import { PostSendFeedbackBodyRequestDto } from '@apps/server/users/dtos/req/postFeedback.dto';
import { GetUserResponseDto } from '@apps/server/users/dtos/res/getUser.dto';
import { FeedbackRepository } from '@libs/modules/database/repositories/feedback/feedback.interface';
import { UserRepository } from '@libs/modules/database/repositories/user/user.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject(UserRepository) private readonly userRepository: UserRepository,
    @Inject(FeedbackRepository) private readonly feedbackRepository: FeedbackRepository,
  ) {}

  /**
   * ### 유저 정보를 가져오는 API
   *
   * 토큰에 있는 유저 아이디를 사용하여 유저의 정보를 조회합니다.
   * nickname, eamil, UserInfo의 imageUrl은 마이페이지를 호버했을 때 사용하기 때문에 필요합니다.
   *
   * @param userId 유저 아이디
   * @returns nickname, email, imageUrl을 DTO로 변환하여 전달합니다.
   */
  async getOneUser(userId: number): Promise<GetUserResponseDto> {
    const userInfo = await this.userRepository.findById(userId);

    // Entity -> DTO
    const getOneUserResponseDto = new GetUserResponseDto(userInfo);

    return getOneUserResponseDto;
  }

  /**
   * 유저가 작성한 피드백을 Feedback 테이블에 저장합니다.
   *
   * @param body 유저가 작성한 피드백이 담긴 객체입니다.
   */
  async sendFeedback(body: PostSendFeedbackBodyRequestDto): Promise<void> {
    const { contents } = body;
    await this.feedbackRepository.create({
      data: { contents },
    });
  }

  async updateUserInfo(userId: number, body: PatchUserInfoBodyRequestDto): Promise<void> {
    if (!Object.keys(body).length) {
      throw new BadRequestException('Please input information to be updated');
    }

    await this.userRepository.update({
      data: { nickname: body.nickname, UserInfo: { update: { field: body.field } } },
      where: { id: userId },
    });
  }
}
