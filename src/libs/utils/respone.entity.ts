import { HttpStatus } from '@nestjs/common';
import { Exclude, Expose } from 'class-transformer';

export class ResponseEntity<T> {
  @Exclude() private readonly _statusCode: HttpStatus; // 상태 코드
  @Exclude() private readonly _message: string; // 메시지
  @Exclude() private readonly _data: T; // Controller response data

  private constructor(status: HttpStatus, message: string, data: T) {
    this._statusCode = status;
    this._message = message;
    this._data = data;
  }

  static OK(): ResponseEntity<string> {
    return new ResponseEntity<string>(HttpStatus.OK, '', '');
  }

  static OK_WITH_MESSAGE(message: string): ResponseEntity<string> {
    return new ResponseEntity<string>(HttpStatus.OK, message, '');
  }

  static OK_WITH_DATA<T>(data: T): ResponseEntity<T> {
    return new ResponseEntity<T>(HttpStatus.OK, '', data);
  }

  static CREATED(): ResponseEntity<string> {
    return new ResponseEntity<string>(HttpStatus.CREATED, '', '');
  }

  static CREATED_WITH_MESSAGE(message: string): ResponseEntity<string> {
    return new ResponseEntity<string>(HttpStatus.CREATED, message, '');
  }

  static CREATED_WITH_DATA<T>(data: T): ResponseEntity<T> {
    return new ResponseEntity<T>(HttpStatus.CREATED, '', data);
  }

  static ERROR<T>(
    statusCode = HttpStatus.INTERNAL_SERVER_ERROR,
    message?: string,
    data?: T,
  ) {
    return new ResponseEntity<T>(statusCode, message, data);
  }

  @Expose()
  get statusCode(): HttpStatus {
    return this._statusCode;
  }

  @Expose()
  get message(): string {
    return this._message;
  }

  @Expose()
  get data(): T {
    return this._data;
  }
}
