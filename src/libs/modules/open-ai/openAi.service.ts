import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';

import { MINUTES } from '@apps/server/common/consts/time.const';
import { EnvEnum } from '@libs/modules/env/env.enum';
import { EnvService } from '@libs/modules/env/env.service';
import { AiResponse } from '@libs/modules/open-ai/interface/aiResponse.interface';
import { openAIModelEnum } from '@libs/modules/open-ai/openAIModel.enum';

@Injectable()
export class OpenAiService {
  private openAIHeader: { [key in string] };
  private OPEN_AI_URL: string;
  private OPEN_AI_MODEL = openAIModelEnum.GPT_3DOT5_TERBO;

  constructor(private readonly envService: EnvService, private readonly httpService: HttpService) {
    this.openAIHeader = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.envService.get(EnvEnum.OPENAI_API_KEY)}`,
    };
    this.OPEN_AI_URL = this.envService.get(EnvEnum.OPENAI_CHAT_URL);
  }

  public async promptChatGPT(content: string): Promise<AiResponse> {
    const data = {
      model: this.OPEN_AI_MODEL,
      messages: [
        {
          role: 'user',
          content,
        },
      ],
    };

    const response = await firstValueFrom(
      this.httpService.post(this.OPEN_AI_URL, data, { headers: this.openAIHeader, timeout: MINUTES * 1000 }).pipe(
        catchError((error) => {
          console.error(error.response?.data);
          throw error;
        }),
      ),
    );

    const responseData = response?.data;

    return responseData as AiResponse;
  }
}
