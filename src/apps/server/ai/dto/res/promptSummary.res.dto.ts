import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const example =
  '와! 개발 동아리에 들어간 결과, 구글, 네이버, 카카오 로그인 및 회원가입/탈퇴 등의 기능 구현을 통해 프론트엔드와 백엔드의 상호 통신 개념과 보안강화 방법인 RTR을 배우게 되었습니다. 앞으로도 열심히 공부하고 개발하는 모습 기대합니다!';
export class PromptSummaryResDto {
  @Exclude() _summary: string;

  constructor(summary: string) {
    this._summary = summary;
  }

  @Expose()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example })
  get resume() {
    return this._summary;
  }
}
