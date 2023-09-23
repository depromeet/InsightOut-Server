import { Injectable } from '@nestjs/common';
import { WebClient } from '@slack/web-api';

import { ExceptionResponse } from 'src/apps/server/common/exceptions/exception.type';

import { SlackBlockType } from './slack.enum';
import { EnvEnum } from '../env/env.enum';
import { EnvService } from '../env/env.service';

@Injectable()
export class SlackService {
  private readonly slackClient: WebClient;

  constructor(private readonly envService: EnvService) {
    const token: string = this.envService.get<string>(EnvEnum.SLACK_TOKEN);
    this.slackClient = new WebClient(token);
  }

  async sendExceptionMessage(exception: ExceptionResponse): Promise<void> {
    const { statusCode, title, message } = exception;

    this.slackClient.chat.postMessage({
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

  async sendFeedback(message: string): Promise<void> {
    this.slackClient.chat.postMessage({
      blocks: [
        {
          type: SlackBlockType.SECTION,
          text: {
            type: SlackBlockType.MRKDWN,
            text: ':loudspeaker: *피드백이 전송되었습니다.*',
          },
        },
        { type: SlackBlockType.DIVIDER },
        {
          type: SlackBlockType.SECTION,
          text: {
            type: SlackBlockType.MRKDWN,
            text: `*일시*: ${new Date()}`,
          },
        },
        {
          type: SlackBlockType.SECTION,
          text: {
            type: SlackBlockType.MRKDWN,
            text: `*내용*\n${message}`,
          },
        },
      ],
      channel: '피드백',
      text: 'InsightOut Feedback',
    });
  }
}
