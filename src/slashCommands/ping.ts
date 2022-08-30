import { SlashCommand } from '../structures/index.js';

export default new SlashCommand({
  name: 'ping',
  description: 'replies with pong!',
  async run({ interaction }) {
    interaction.followUp('pong!');
  },
});
