import { MessageCommand } from '../structures/index.js';

export default new MessageCommand({
  name: 'ping',
  description: 'replies with pong!',
  async run({ message }) {
    message.reply('pong!');
  },
});
