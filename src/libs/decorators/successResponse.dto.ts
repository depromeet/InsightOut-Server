import { HttpStatus, Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

import { SuccessCommonResponseDto } from '@libs/dtos/successCommonDto';
import { makeInstanceByApiProperty } from '@libs/helpers/makeInstanceByApiPropertyFunction';
import { mergeObjects } from '@libs/utils/mergeTwoObject.function';

interface SuccessResponseOption {
  /**
   * 응답 디티오를 인자로받습니다
   * 예시 : ResponseRequestValidationDto
   */
  model: Type<any>;
  /**
   * 예시의 제목을 적습니다
   */
  exampleTitle: string;
  /**
   *  깊은 복사로 변경하고 싶은 응답값을 적습니다. 오버라이트 됩니다.
   *  nested 된 obj 인 경우엔 해당 obj 가 바뀌는것이아닌 안에 있는 property만 바뀝니다.
   *  즉 주어진 객체로 리프 프로퍼티에 대해 오버라이트됩니다.
   */
  overwriteValue?: Record<string, any>;
  /**
   * 어떠한 상황일 때 예시형태의 응답값을 주는지 기술 합니다.
   */
  exampleDescription: string;
  /**
   * 제네릭 형태가 필요할 때 기술합니다.
   * pageDto<generic> 인경우?
   */
  generic?: Type<any>;
}

export const SuccessResponse = (statusCode: HttpStatus, successResponseOptions: SuccessResponseOption[]) => {
  const examples = successResponseOptions
    .map((response: SuccessResponseOption) => {
      // base CommonResponse 생성
      const commonResponseInstance = makeInstanceByApiProperty<SuccessCommonResponseDto<any>>(SuccessCommonResponseDto);

      const dtoModel = response.model;

      // DTO 객체 생성. 제너릭은 옵셔널한 값이므로 없으면 생성.
      const dtoData = makeInstanceByApiProperty<typeof dtoModel>(dtoModel, response.generic);

      // overWriteValue가 있으면 오버라이트
      if (response.overwriteValue) {
        commonResponseInstance.data = mergeObjects({}, dtoData, response.overwriteValue);
      } else {
        commonResponseInstance.data = dtoData;
      }

      // 예시 정보 생성
      return {
        [response.exampleTitle]: {
          value: commonResponseInstance,
          description: response.exampleDescription,
        },
      };
    })
    .reduce((result, item) => {
      Object.assign(result, item);
      return result;
    }, {});

  // 스키마 정의 함수
  const extraModel = successResponseOptions.map((e) => {
    return e.model;
  });

  // 중복값 제거
  const setOfExtraModel = new Set(extraModel);

  // $ref 추가
  const pathsOfDto = [...setOfExtraModel].map((e) => {
    return { $ref: getSchemaPath(e) };
  });

  // 제네릭
  const extraGeneric = successResponseOptions
    .map((e) => {
      return e.generic;
    })
    .filter((e) => e);
  const pathsOfGeneric = extraGeneric.map((e) => {
    return { $ref: getSchemaPath(e) };
  });

  // 데코레이터 생성
  return applyDecorators(
    // $ref를 사용하기 위해서 extraModel로 등록 시켜야 함.
    ApiExtraModels(...extraModel, ...extraGeneric, SuccessCommonResponseDto),
    ApiResponse({
      status: statusCode,
      content: {
        'application/json': {
          schema: {
            // 베이스 스키마
            additionalProperties: {
              $ref: getSchemaPath(SuccessCommonResponseDto),
            },
            // dto 스키마들
            oneOf: [...pathsOfDto, ...pathsOfGeneric],
          },
          // 예시값
          examples,
        },
      },
    }),
  );
};
