import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { byLength, parseJSON, parseJSONFromDaum, split } from '../../utils/hanspell.function';
import { SpellCheckResult } from './api.type';
import { NICKNAME_ADJECTIVE, NICKNAME_NOUN } from '📚libs/modules/api/data/nickname_word.data';

@Injectable()
export class ApiService {
  constructor(private readonly httpService: HttpService) {}

  getRandomNickname(): string {
    const adjective = NICKNAME_ADJECTIVE[Math.floor(Math.random() * NICKNAME_ADJECTIVE.length)];

    const noun = NICKNAME_NOUN[Math.floor(Math.random() * NICKNAME_NOUN.length)];

    return adjective + ' ' + noun;
  }

  async spellCheckByPNU(sentence: string) {
    if (sentence.length === 0) {
      return [];
    }

    const PNU_MAX_WORDS = 1000;
    const PNU_URL = 'http://speller.cs.pusan.ac.kr/results';

    sentence = sentence.replace(/<[^ㄱ-ㅎㅏ-ㅣ가-힣>]+>/g, '');
    const data = split(`${sentence.replace(/([^\r])\n/g, '$1\r\n')}\r\n`, PNU_MAX_WORDS);

    const sentences = await Promise.all(
      data.map(async (part) => {
        const response = this.httpService.post(
          PNU_URL,
          { text1: part },
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          },
        );
        const responseData = await firstValueFrom(response);
        return parseJSON(responseData.data);
      }),
    );
    return sentences;
  }

  /**
   * 주어진 문장을 2500글자 단위로 나눠서 맞춤법 검사를 진행합니다.
   * @param sentence 입력된 글
   * @returns 글에서 맞춤법오류 종류, 맞춤법 오류 토큰, 정정 토큰, 맞춤법이 틀린 곳의 문장, 정정 이유를 배열로 반환합니다.
   */
  async spellCheckByDaum(sentence: string): Promise<SpellCheckResult[][]> {
    const DAUM_URL = 'https://dic.daum.net/grammar_checker.do';
    const DAUM_MAX_CHARS = 2500;

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
