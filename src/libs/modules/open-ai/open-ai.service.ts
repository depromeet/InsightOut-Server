import { Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';
import { EnvService } from '📚libs/modules/env/env.service';
import { EnvEnum } from '📚libs/modules/env/env.enum';

@Injectable()
export class OpenAiService {
  private configuration;
  private openaiApi;
  constructor(private readonly envService: EnvService) {
    const headers = {
      'content-type': 'application/json',
      'X-RapidAPI-Key': 'your-rapid-key',
    };

    this.configuration = new Configuration({
      organization: this.envService.get(EnvEnum.OPENAI_ORGANIZATION_ID),
      apiKey: this.envService.get(EnvEnum.OPENAI_API_KEY),
    });

    this.openaiApi = new OpenAIApi(this.configuration);
    console.log(this.openaiApi);
  }

  public async send() {
    await this.openaiApi.createCompletion({
      model: 'text-ada-001',
      prompt: 'how can you learn English?',
      max_tokens: 50,
      temperature: 0.2,
    });
    const response = await this.openaiApi.listEngines();

    return response;
  }
}
