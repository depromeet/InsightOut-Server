import { HttpStatus } from '@nestjs/common';
import { Exclude, Expose } from 'class-transformer';

export class ResponseEntity<T> {
  @Exclude() private readonly _statusCode: HttpStatus; // 상태 코드
  @Exclude() private readonly _success: boolean; // 성공 여부
  @Exclude() private readonly _data: T; // Controller response data
  @Exclude() private readonly _title?: string;
  @Exclude() private readonly _message?: string; // 메시지

  constructor(status: HttpStatus, success: boolean, options?: { data?: T; message?: string; title?: string }) {
    this._statusCode = status;
    this._success = success;
    this._message = options.message;
    this._data = options.data;
  }

  static OK(): ResponseEntity<string> {
    return new ResponseEntity<string>(HttpStatus.OK, true);
  }

  static OK_WITH_MESSAGE(message: string): ResponseEntity<string> {
    return new ResponseEntity<string>(HttpStatus.OK, true, { message });
  }

  static OK_WITH_DATA<T>(data: T, message?: string): ResponseEntity<T> {
    return new ResponseEntity<T>(HttpStatus.OK, true, { data, message });
  }

  static CREATED(): ResponseEntity<string> {
    return new ResponseEntity<string>(HttpStatus.CREATED, true);
  }

  static CREATED_WITH_MESSAGE(message: string): ResponseEntity<string> {
    return new ResponseEntity<string>(HttpStatus.CREATED, true, { message });
  }

  static CREATED_WITH_DATA<T>(data: T, message?: string): ResponseEntity<T> {
    return new ResponseEntity<T>(HttpStatus.CREATED, true, { data, message });
  }

  static ERROR<T>(statusCode = HttpStatus.INTERNAL_SERVER_ERROR, title?: string, message?: string, data?: T) {
    return new ResponseEntity<T>(statusCode, false, { data, message, title });
  }

  @Expose()
  get statusCode(): HttpStatus {
    return this._statusCode;
  }

  @Expose()
  get success(): boolean {
    return this._success;
  }

  @Expose()
  get message(): string | undefined {
    return this._message;
  }

  @Expose()
  get data(): T | undefined {
    return this._data;
  }

  @Expose()
  get title(): string | undefined {
    return this._title;
  }
}
