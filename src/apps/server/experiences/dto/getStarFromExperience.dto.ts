import { ApiProperty } from '@nestjs/swagger';
import { Experience } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsPositive, IsString, MaxLength, MinLength } from 'class-validator';

export class GetStarFromExperienceRequestParamDto {
  @ApiProperty({
    description: '경험 카드 id입니다.',
    example: 1234,
    type: Number,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  @Type(() => Number)
  experienceId: number;
}

export class GetStarFromExperienceResponseDto {
  @Exclude() private readonly _id: number;
  @Exclude() private readonly _title: string;
  @Exclude() private readonly _situation: string;
  @Exclude() private readonly _task: string;
  @Exclude() private readonly _action: string;
  @Exclude() private readonly _result: string;

  constructor(experience: Pick<Experience, 'id' | 'title' | 'situation' | 'task' | 'action' | 'result'>) {
    this._id = experience.id;
    this._title = experience.title;
    this._situation = experience.situation;
    this._task = experience.task;
    this._action = experience.action;
    this._result = experience.result;
  }

  @Expose()
  @ApiProperty({
    description: '경험카드의 id입니다.',
    example: 1234,
    type: Number,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  get id(): number {
    return this._id;
  }

  @Expose()
  @ApiProperty({
    description: '경험 카드의 제목입니다.',
    example: '디프만 12기 백엔드 파트장',
    type: String,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  @IsNotEmpty()
  get title(): string {
    return this._title;
  }

  @Expose()
  @ApiProperty({
    description: 'STAR의 S: situation으로, 경험카드에서 활동의 계기나 배경으로 적은 내용입니다. 최대 100자입니다.',
    example: '코딩에 관심이 생겼고, 디자이너와 협업이 하고 싶었음',
    type: String,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @IsNotEmpty()
  get situation(): string {
    return this._situation;
  }

  @Expose()
  @ApiProperty({
    description: 'STAR의 T: task로, 경험카드에서 당시 해결해야 하는 과제나 목표로 적은 내용입니다. 최대 100자입니다.',
    example: '백엔드 파트장으로서 팀을 이끌어야 했고, 소셜 로그인 API를 모두 구현해야 했음',
    type: String,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @IsNotEmpty()
  get task(): string {
    return this._task;
  }
  @Expose()
  @ApiProperty({
    description: 'STAR의 A: action으로, 경험카드에서 내가 취한 행동 또는 계획으로 적은 내용입니다. 최대 100자입니다.',
    example: '모든 API 명세를 읽어보았고, 어떻게 소셜 로그인 제공자 서버와 통신하는지 공부함',
    type: String,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @IsNotEmpty()
  get action(): string {
    return this._action;
  }
  @Expose()
  @ApiProperty({
    description:
      'STAR의 R: result로, 경험카드에서 어떤 성과(객관적 사실, 정량적 수치)를 이룰 수 있었는지에 관해 적은 내용입니다. 최대 100자입니다.',
    example: '미친 성장을 할 수 있었다.',
    type: String,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @IsNotEmpty()
  get result(): string {
    return this._result;
  }
}
