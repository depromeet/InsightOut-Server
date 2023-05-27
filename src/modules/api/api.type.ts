import { ApiProperty } from '@nestjs/swagger';

export class SpellCheckResult {
  @ApiProperty({
    description: '오류 타입',
  })
  type: string;

  @ApiProperty({
    description: '오류 토큰',
  })
  token: string;

  @ApiProperty({
    description: '정정 내용',
    type: String,
    isArray: true,
  })
  suggestions: string[];

  @ApiProperty({
    description: '오류 맥락',
  })
  context: string;

  @ApiProperty({
    description: '맞춤법이 틀린 이유',
  })
  info: string;
}
