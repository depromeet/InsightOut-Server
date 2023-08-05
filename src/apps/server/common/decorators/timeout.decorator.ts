import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';

import { TimeoutInterceptor } from '@apps/server/common/interceptors/timeout.interceptor';

/**
 * ### 요청 타임아웃을 설정하는 데코레이터
 *
 * @param timeout milliseconds
 * @returns
 */
export function SetRequestTimeout(timeout: number) {
  return applyDecorators(SetTimeout(timeout), UseInterceptors(TimeoutInterceptor));
}

const SetTimeout = (timeout: number) => SetMetadata('request-timeout', timeout);
