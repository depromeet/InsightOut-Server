import { ApiProperty } from '@nestjs/swagger';

export class SpellCheckResult {
  @ApiProperty({
    description: '오류 타입',
    example: 'space',
  })
  type: string;

  @ApiProperty({
    description: '오류 토큰',
    example: '일년에',
  })
  token: string;

  @ApiProperty({
    description: '정정 내용',
    type: String,
    isArray: true,
    example: ['일 년에'],
  })
  suggestions: string[];

  @ApiProperty({
    description: '오류 맥락',
    example: '최초로 시작되어 일년에 한바퀴를 돌면서',
  })
  context: string;

  @ApiProperty({
    description: '맞춤법이 틀린 이유',
    example: '띄어쓰기 오류입니다. 대치어를 참고하여 고쳐 쓰세요.',
  })
  info: string;
}
