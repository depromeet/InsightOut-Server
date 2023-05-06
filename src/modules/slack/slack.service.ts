import { Injectable } from '@nestjs/common';
import { ExceptionResponse } from 'src/apps/server/exceptions/exception.type';
import { EnvEnum } from '../env/env.enum';
import { EnvService } from '../env/env.service';
import { WebClient } from '@slack/web-api';
import { SlackBlockType } from './slack.enum';

@Injectable()
export class SlackService {
  constructor(private readonly envService: EnvService) {}

  sendExceptionMessage(exception: ExceptionResponse): void {
    const { statusCode, title, message } = exception;
    const token: string = this.envService.get<string>(EnvEnum.SLACK_TOKEN);
    const web: WebClient = new WebClient(token);

    web.chat.postMessage({
      blocks: [
        {
          type: SlackBlockType.SECTION,
          text: {
            type: SlackBlockType.MRKDWN,
            text: ':warning: *An error has occured!* :warning:',
          },
        },
        { type: SlackBlockType.DIVIDER },
        {
          type: SlackBlockType.SECTION,
          text: {
            type: SlackBlockType.MRKDWN,
            text: `statusCode: ${statusCode}\ntitle: ${title}\nmessage: ${message}`,
          },
        },
      ],
      channel: '4팀-알림',
      text: 'InsightOut exception message',
    });
  }
}
