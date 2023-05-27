import { applyDecorators, Delete, Get, HttpStatus, Patch, Post, Put } from '@nestjs/common';
import { ApiCreatedResponse, ApiHeader, ApiNoContentResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

export type RouteProps<ResponseBody = any> = {
  request: {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    path?: string;
    headers?: string[];
  };
  response: {
    code: HttpStatus.OK | HttpStatus.CREATED | HttpStatus.NO_CONTENT;
    type?: ResponseBody;
  };
  summary?: string;
  description?: string;
};

export function Route({ summary, description, request, response }: RouteProps) {
  const conditionDecorator: (ClassDecorator | MethodDecorator | PropertyDecorator)[] = [];

  if (request) {
    //Header
    if (request.headers) {
      request.headers.forEach((key) => {
        conditionDecorator.push(
          ApiHeader({
            required: true,
            name: key,
          }),
        );
      });
    }
  }

  switch (response.code) {
    case HttpStatus.OK:
      conditionDecorator.push(
        ApiOkResponse({
          description: `${request.method} 요청 응답`,
          type: response.type,
        }),
      );
      break;
    case HttpStatus.CREATED:
      conditionDecorator.push(
        ApiCreatedResponse({
          description: `${request.method} 요청 응답`,
          type: response.type,
        }),
      );
      break;
    case HttpStatus.NO_CONTENT:
      conditionDecorator.push(
        ApiNoContentResponse({
          description: `${request.method} 요청 응답 대기 후 진행`,
        }),
      );
      break;
  }

  let methodDecorator: (path?: string | string[]) => MethodDecorator;
  switch (request.method) {
    case 'GET':
      methodDecorator = Get;
      break;
    case 'POST':
      methodDecorator = Post;
      break;
    case 'PUT':
      methodDecorator = Put;
      break;
    case 'PATCH':
      methodDecorator = Patch;
      break;
    case 'DELETE':
      methodDecorator = Delete;
      break;
  }

  return applyDecorators(
    ...conditionDecorator,
    methodDecorator(request.path),
    ApiOperation({ summary, description }),
    // ApiBadRequestResponse({
    //   description: '잘못된 요청',
    //   type: BaseException,
    // }),
    // ApiForbiddenResponse({
    //   description: '접근 불가',
    //   type: BaseException,
    // }),
    // ApiInternalServerErrorResponse({
    //   description: '서버측 오류',
    //   type: BaseException,
    // }),
  );
}
