import { Injectable } from '@nestjs/common';
import { IncomingWebhook, IncomingWebhookDefaultArguments } from '@slack/webhook';

@Injectable()
export class SlackLoggerService {
  private webhook: IncomingWebhook | null = null;

  constructor(config: { url: string; defaults?: IncomingWebhookDefaultArguments }) {
    const { url, defaults } = config;
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
