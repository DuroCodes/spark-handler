import { SlashCommand } from '../structures';

export default new SlashCommand({
  name: 'ping',
  cooldown: 10000,
  description: 'replies with pong!',
  async run({ interaction }) {
    interaction.followUp('pong!');
  },
});
