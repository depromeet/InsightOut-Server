import { Injectable, NestInterceptor, ExecutionContext, CallHandler, RequestTimeoutException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

/**
 * ## 타임아웃 인터셉터
 *
 * 원하는 타임아웃에서 벗어나면 408 타임아웃 에러를 반환합니다. 프론트 & 백 타임아웃 확인용입니다.
 */
@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const setTimeout = this.reflector.get<number>('request-timeout', context.getHandler()) || 60000;

    return next.handle().pipe(
      timeout(setTimeout),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException());
        }
        return throwError(() => err);
      }),
    );
  }
}
