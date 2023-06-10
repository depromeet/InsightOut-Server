import { Injectable } from '@nestjs/common';
import { EnvService } from '📚libs/modules/env/env.service';
import { EnvEnum } from '📚libs/modules/env/env.enum';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class OpenAiService {
  private openAIHeader: { [key in string] };
  private OPEN_AI_MODEL = 'text-ada-001';
  private OPEN_AI_MAX_TOKEN = 50;
  private OPEN_AI_TEMPERATURE = 0;

  constructor(private readonly envService: EnvService, private readonly httpService: HttpService) {
    this.openAIHeader = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.envService.get(EnvEnum.OPENAI_API_KEY)}`,
    };
  }

  public async promptChatGPT(prompt: string): Promise<{ text: string }> {
    /*
     * max_tokens 프로퍼티는 GPT 모델 답변의 길이를 제한합니다. Ex) max_tokens가 50이면 50개의 토큰을 생성 한 후 모델의 응답이 잘리게 됩니다.
     * temperature 프로퍼티는 창의성의 정도입니다. temperature가 낮으면 가장 가능성이 높고 보수적인 응답을 뱉어내고 1.0과 같이 높으면 창의적인 답변이 나오게 됩니다.
     */
    const data = {
      model: this.OPEN_AI_MODEL,
      prompt,
      max_tokens: this.OPEN_AI_MAX_TOKEN,
      temperature: this.OPEN_AI_TEMPERATURE,
    };

    const response = await firstValueFrom(
      this.httpService.post('https://api.openai.com/v1/completions', data, { headers: this.openAIHeader }).pipe(
        catchError((error) => {
          throw error;
        }),
      ),
    );
    const responseData = response.data; //.choices[0].text;
    if (typeof responseData === 'string') return { text: responseData };
    return responseData;
  }
}
