import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class ApiService {
  constructor(private readonly httpService: HttpService) {}

  async getRandomNickname(): Promise<string> {
    const response = await firstValueFrom(
      this.httpService
        .get('https://nickname.hwanmoo.kr/?format=text&max_length=6')
        .pipe(
          catchError((error) => {
            throw error;
          }),
        ),
    );
    const responseData = response.data;

    return responseData;
  }
}
