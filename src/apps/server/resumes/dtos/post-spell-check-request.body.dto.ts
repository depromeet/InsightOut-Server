import { IsString, MaxLength } from 'class-validator';

export class PostSpellCheckRequestBodyDto {
  @IsString()
  @MaxLength(2000)
  sentence: string;
}
