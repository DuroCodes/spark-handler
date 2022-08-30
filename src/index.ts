import { GatewayIntentBits } from 'discord.js';
import { ExtendedClient } from './lib/index.js';

export const client = new ExtendedClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  loggingEnabled: true,
});

client.start();
