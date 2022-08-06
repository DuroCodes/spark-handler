import { MessageCommand } from '../structures';

export default new MessageCommand({
  name: 'ping',
  description: 'replies with pong!',
  async run({ message }) {
    message.reply('pong!');
  },
});
