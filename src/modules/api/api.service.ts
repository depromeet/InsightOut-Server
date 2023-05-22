import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import {
  byLength,
  parseJSON,
  parseJSONFromDaum,
  split,
} from '../../libs/utils/hanspell.function';
import { SpellCheckResult } from './api.type';

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

  async spellCheckByPNU(sentence: string) {
    if (sentence.length === 0) {
      return [];
    }

    const PNU_MAX_WORDS = 1000;
    const PNU_URL = 'http://speller.cs.pusan.ac.kr/results';

    sentence = sentence.replace(/<[^ㄱ-ㅎㅏ-ㅣ가-힣>]+>/g, '');
    const data = split(
      `${sentence.replace(/([^\r])\n/g, '$1\r\n')}\r\n`,
      PNU_MAX_WORDS,
    );

    const sentences = await Promise.all(
      data.map(async (part) => {
        const response = this.httpService.post(
          PNU_URL,
          { text1: part },
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          },
        );
        // console.log(response);
        const responseData = await firstValueFrom(response);
        // console.log(responseData);
        return parseJSON(responseData.data);
      }),
    );
    return sentences;
  }

  async spellCheckByDaum(sentence: string): Promise<SpellCheckResult[][]> {
    const DAUM_URL = 'https://dic.daum.net/grammar_checker.do';
    const DAUM_MAX_CHARS = 2000;

    // Removes HTML tags.
    sentence = sentence.replace(/<[^ㄱ-ㅎㅏ-ㅣ가-힣>]+>/g, '');
    const data = byLength(sentence, '.,\n', DAUM_MAX_CHARS);

    const sentences = await Promise.all(
      data.map(async (part: string) => {
        const response = this.httpService.post(
          DAUM_URL,
          {
            sentence: part,
          },
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
        );
        const responseData = await firstValueFrom(response);
        return parseJSONFromDaum(responseData.data);
      }),
    );

    return sentences;
  }
}
