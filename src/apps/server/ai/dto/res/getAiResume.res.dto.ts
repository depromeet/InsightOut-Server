import { Exclude, Expose, Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsDate, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AiResumeResDto {
  @Exclude() _id: number;
  @Exclude() _content: string;
  @Exclude() _updatedAt: Date;
  @Exclude() _AiCapabilities: string[];

  constructor(AiResume: { AiResumeCapability: { Capability: { keyword: string } }[]; id: number; updatedAt: Date; content: string }) {
    this._id = AiResume.id;
    this._content = AiResume.content;
    this._updatedAt = AiResume.updatedAt;
    this._AiCapabilities = AiResume.AiResumeCapability.map((capabilities) => capabilities.Capability.keyword);
  }
  @Expose()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 1 })
  get id() {
    return this._id;
  }
  @Expose()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 1 })
  get content() {
    return this._content;
  }
  @Expose()
  @IsNotEmpty()
  @IsDate()
  @ApiProperty({ example: '2023-06-18T13:14:03.698Z' })
  get updatedAt() {
    return this._updatedAt;
  }
  @Expose()
  @IsArray()
  @ArrayMaxSize(2)
  @ArrayMinSize(1)
  @ApiProperty({ example: ['협업 능력', '추진력'] })
  get AiCapabilities() {
    return this._AiCapabilities;
  }
}

export class GetAiResumeResDto {
  @Exclude() _AiResumes: AiResumeResDto[];

  constructor(AiResumeResDtoArr: AiResumeResDto[]) {
    this._AiResumes = AiResumeResDtoArr;
  }

  @IsArray()
  @Expose()
  @Type(() => AiResumeResDto)
  @ValidateNested({ each: true })
  @ApiProperty({ type: AiResumeResDto, isArray: true })
  get AiResumes(): AiResumeResDto[] {
    return this._AiResumes;
  }
}
