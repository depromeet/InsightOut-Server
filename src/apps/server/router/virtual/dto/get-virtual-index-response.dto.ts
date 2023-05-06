import { ApiProperty } from '@nestjs/swagger';

export class GetVirtualIndexResponseDto {
  @ApiProperty()
  text: string;

  constructor(properties: GetVirtualIndexResponseDto) {
    this.text = properties.text;
  }
}
