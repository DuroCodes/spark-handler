import { Events } from 'discord.js';
import ms from 'ms';
import { client } from '../..';
import { env } from '../../lib';
import { Event } from '../../structures';

export default new Event({
  event: Events.MessageCreate,
  async run(message) {
    if (
      message.author.bot
      || !message.guild
      || !message.content.toLowerCase().startsWith(env.PREFIX)
    ) return;

    const [cmd, ...args] = message.content
      .slice(env.PREFIX.length)
      .trim()
      .split(/ +/g);

    if (!cmd) return;

    const command = client.messageCommands.get(cmd.toLowerCase())
      || client.messageCommands.find((c) => !!c.aliases?.includes(cmd.toLowerCase()));

    if (!command) return;

    if (
      command.memberPermission
      && !(message.member?.permissions.has(command.memberPermission))
    ) return client.embeds.permissionError({ message, permission: command.memberPermission, user: 'You' });

    if (
      command.botPermission
      && !(message.guild.members.me?.permissions.has(command.botPermission))
    ) return client.embeds.permissionError({ message, permission: command.botPermission, user: 'I' });

    if (command.cooldown) {
      const timeout = `${command.name}${message.author.id}`;

      if (client.messageCommandCooldowns.has(timeout)) {
        return client.embeds.error({
          reason: `You are on a \`${ms(client.messageCommandCooldowns.get(timeout) as number - Date.now(), { long: true })}\` timeout`,
          message,
        });
      }

      try {
        await command.run({
          message,
          args,
          client,
        });

        client.messageCommandCooldowns.set(timeout, Date.now() + command.cooldown);

        return setTimeout(() => {
          client.messageCommandCooldowns.delete(timeout);
        }, command.cooldown);
      } catch (e: any) {
        client.logger.error(e.stack);
        return client.embeds.error({ message, reason: `An error occured while running the command.\n\`\`\`sh\n${e}\`\`\`` });
      }
    }

    try {
      return await command.run({
        message,
        args,
        client,
      });
    } catch (e: any) {
      client.logger.error(e.stack);
      return client.embeds.error({ message, reason: `An error occured while running the command.\n\`\`\`sh\n${e}\`\`\`` });
    }
  },
});
