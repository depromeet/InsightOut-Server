import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class PostSendFeedbackRequestBodyDto {
  @ApiProperty({
    description: '피드백 내용입니다. 유저가 서비스에서 회원 탈퇴하는 이유입니다.',
    example: '나때는 일일이 다 한글로 정리해서 파일에 넣어놨는데 세상 좋아졌구만',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(300)
  contents: string;
}
