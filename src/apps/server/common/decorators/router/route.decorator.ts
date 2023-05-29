import {
  applyDecorators,
  BadGatewayException,
  Delete,
  ForbiddenException,
  GatewayTimeoutException,
  Get,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Patch,
  Post,
  Put,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiGatewayTimeoutResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

export type RouteProps<ResponseBody = any> = {
  request: {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    path?: string;
    headers?: string[];
  };
  response: {
    code: HttpStatus.OK | HttpStatus.CREATED | HttpStatus.NO_CONTENT;
    description?: string;
    type?: ResponseBody;
    isArray?: boolean;
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
          description: response.description ?? `${request.method} 요청 응답`,
          type: response.type,
          isArray: response.isArray,
        }),
      );
      break;
    case HttpStatus.CREATED:
      conditionDecorator.push(
        ApiCreatedResponse({
          description: response.description ?? `${request.method} 요청 응답`,
          type: response.type,
          isArray: response.isArray,
        }),
      );
      break;
    case HttpStatus.NO_CONTENT:
      conditionDecorator.push(
        ApiNoContentResponse({
          description: response.description ?? `${request.method} 요청 응답 대기 후 진행`,
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
    ApiBadRequestResponse({
      description: '잘못된 요청입니다.',
      // type: NotFoundException,
    }),
    ApiUnauthorizedResponse({
      description: '권한이 없습니다.',
      // type: UnauthorizedException,
    }),
    ApiForbiddenResponse({
      description: '접근이 불가합니다.',
      // type: ForbiddenException,
    }),
    ApiInternalServerErrorResponse({
      description: '서버에서 오류가 발생했습니다.',
      // type: InternalServerErrorException,
    }),
    ApiUnprocessableEntityResponse({
      description: '서버측 엔티티와 맞지 않은 요청입니다.',
      // type: UnprocessableEntityException,
    }),
    ApiBadGatewayResponse({
      description: '서버에 에러가 발생하여 접근할 수 없습니다.',
      // type: BadGatewayException
    }),
    ApiGatewayTimeoutResponse({
      description: '요청 시간이 초과되었습니다.',
      // type: GatewayTimeoutException,
    }),
  );
}
