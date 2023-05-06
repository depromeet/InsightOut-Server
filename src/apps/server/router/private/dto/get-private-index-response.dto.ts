import { ApiProperty } from '@nestjs/swagger';

export class GetPrivateIndexResponseDto {
  @ApiProperty()
  text: string;

  constructor(properties: GetPrivateIndexResponseDto) {
    this.text = properties.text;
  }
}
