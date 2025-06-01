import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IncomingWebhook, IncomingWebhookDefaultArguments } from '@slack/webhook';

@Injectable()
export class SlackLoggerService {
  private webhook: IncomingWebhook | null = null;

  constructor(private configService: ConfigService) {
    const { url, defaults } = this.configService.get('slack');
    if (url) {
      this.webhook = new IncomingWebhook(url, defaults);
    }
  }

  async send(message: string, meta?: Record<string, unknown>) {
    if (!this.webhook) return;
    await this.webhook.send({
      text: `*${message}*${meta ? `\n\`\`\`${JSON.stringify(meta, null, 2)}\`\`\`` : ''}`,
    });
  }
}
