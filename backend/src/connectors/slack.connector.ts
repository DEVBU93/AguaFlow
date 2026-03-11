import { WebClient } from '@slack/web-api';

export interface SlackMetrics {
  totalChannels: number;
  activeChannels: number;
  totalMembers: number;
  avgMessagesPerDay: number;
  responseTime: number; // avg minutes
  teamEngagement: number; // 0-100
}

export class SlackConnector {
  private client: WebClient;

  constructor(token: string) {
    this.client = new WebClient(token);
  }

  async analyzeWorkspace(): Promise<SlackMetrics> {
    try {
      const channelsRes = await this.client.conversations.list({ limit: 200, types: 'public_channel' });
      const channels = channelsRes.channels || [];
      
      const usersRes = await this.client.users.list({ limit: 500 });
      const users = (usersRes.members || []).filter((u: any) => !u.is_bot && !u.deleted);

      // Sample message activity from last 7 days
      let totalMessages = 0;
      let activeChannels = 0;
      const oneWeekAgo = Math.floor((Date.now() - 7 * 24 * 60 * 60 * 1000) / 1000).toString();

      for (const channel of channels.slice(0, 20)) {
        try {
          const history = await this.client.conversations.history({
            channel: channel.id!, oldest: oneWeekAgo, limit: 100
          });
          const count = history.messages?.length || 0;
          totalMessages += count;
          if (count > 0) activeChannels++;
        } catch { /* no access */ }
      }

      const avgPerDay = totalMessages / 7;
      const engagement = Math.min(100, (activeChannels / Math.max(channels.length, 1)) * 70 +
                                       Math.min(30, (avgPerDay / Math.max(users.length, 1)) * 100));

      return {
        totalChannels: channels.length,
        activeChannels,
        totalMembers: users.length,
        avgMessagesPerDay: Math.round(avgPerDay),
        responseTime: 0, // would need message threading analysis
        teamEngagement: Math.round(engagement)
      };
    } catch (error: any) {
      throw new Error(`Slack analysis failed: ${error.message}`);
    }
  }
}
