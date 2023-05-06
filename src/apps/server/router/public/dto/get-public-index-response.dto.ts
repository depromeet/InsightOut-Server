import { ApiProperty } from '@nestjs/swagger';

export class GetPublicIndexResponseDto {
  @ApiProperty({ description: '기본 문자열' })
  text: string;

  constructor(properties: GetPublicIndexResponseDto) {
    this.text = properties.text;
  }
}
