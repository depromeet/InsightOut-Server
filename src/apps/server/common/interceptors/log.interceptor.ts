import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import * as RequestIp from 'request-ip';
import { Observable, tap } from 'rxjs';
import { LogService } from '📚libs/modules/log/log.service';
@Injectable()
export class LogInterceptor implements NestInterceptor {
  constructor(private readonly logService: LogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest() as Request;

    this.logService.info(LogInterceptor.name, 'Request', {
      headers: request.headers,
      query: request.query,
      params: request.params,
      ip: RequestIp.getClientIp(request),
      body: request.body,
    });

    return next.handle().pipe(tap((response) => this.logService.info(LogInterceptor.name, `Response`, response)));
  }
}
