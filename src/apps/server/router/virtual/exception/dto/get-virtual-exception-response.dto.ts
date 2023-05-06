import { ApiProperty } from '@nestjs/swagger';

export class GetVirtualExceptionResponseDto {
  @ApiProperty()
  ok: boolean;

  constructor(properties: GetVirtualExceptionResponseDto) {
    this.ok = properties.ok;
  }
}
