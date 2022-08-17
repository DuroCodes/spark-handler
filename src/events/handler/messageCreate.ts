import { Events, GuildMemberRoleManager } from 'discord.js';
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

    if (command.requiredRoleId) {
      if (command.requiredRoleId instanceof Array
        && !(command.requiredRoleId.some(
          (x) => (message.member?.roles as GuildMemberRoleManager).cache.has(x),
        ))
      ) {
        const requiredRoles = command.requiredRoleId.map(
          (x) => message.guild?.roles.cache.get(x),
        ).filter((x) => x);

        if (!requiredRoles.length) {
          client.logger.warn(`Could not find required role ids: ${command.requiredRoleId}`);
          return client.embeds.error({
            message,
            reason: `An error occurred while trying to find the required role(s).\n\n**Required Role ID(s):** \`${command.requiredRoleId.join(', ')}\``,
          });
        }

        return client.embeds.error({
          message,
          reason: `You do not have the required role(s) to use this command.\n\n**Required Role(s):** \`${requiredRoles.map((x) => x?.name).join(', ')}\``,
        });
      }

      if (
        !(command.requiredRoleId instanceof Array)
        && !((message.member?.roles as GuildMemberRoleManager)
          .cache.has(command.requiredRoleId as string))
      ) {
        const requiredRole = message.guild?.roles.cache.get(command.requiredRoleId as string);

        if (!requiredRole) {
          client.logger.warn(`Could not find required role id: ${command.requiredRoleId}`);
          return client.embeds.error({
            message,
            reason: `An error occurred while trying to find the required role.\n\n**Required Role ID:** \`${command.requiredRoleId}\``,
          });
        }

        return client.embeds.error({
          message,
          reason: `You do not have the required role to use this command.\n\n**Required Role:** \`${requiredRole?.name}\`\n**Role ID:** \`${requiredRole?.id}\``,
        });
      }
    }

    if (command.requiredRoleName) {
      if (command.requiredRoleName instanceof Array
        && !(command.requiredRoleName.some(
          (x) => (
            message.member?.roles as GuildMemberRoleManager).cache.some((y) => y.name === x),
        ))
      ) {
        const requiredRoles = command.requiredRoleName.map(
          (x) => message.guild?.roles.cache.find((y) => y.name === x),
        ).filter((x) => x);

        if (!requiredRoles.length) {
          client.logger.warn(`Could not find required role names: ${command.requiredRoleName}`);
          return client.embeds.error({
            message,
            reason: `An error occurred while trying to find the required role(s).\n\n**Required Role(s):** \`${command.requiredRoleName.join(', ')}\``,
          });
        }

        return client.embeds.error({
          message,
          reason: `You do not have the required role(s) to use this command.\n\n**Required Role(s):** \`${requiredRoles.map((x) => x?.name).join(', ')}\``,
        });
      }

      if (
        !(command.requiredRoleName instanceof Array)
        && !((message.member?.roles as GuildMemberRoleManager).cache.some(
          (x) => x.name === command.requiredRoleName,
        ))
      ) {
        const requiredRole = message.guild?.roles.cache.find(
          (x) => x.name === command.requiredRoleName,
        );

        if (!requiredRole) {
          client.logger.warn(`Could not find required role name: ${command.requiredRoleName}`);
          return client.embeds.error({
            message,
            reason: `An error occurred while trying to find the required role.\n\n**Required Role:** \`${command.requiredRoleName}\``,
          });
        }

        return client.embeds.error({
          message,
          reason: `You do not have the required role to use this command.\n\n**Required Role:** \`${requiredRole?.name}\`\n**Role ID:** \`${requiredRole?.id}\``,
        });
      }
    }

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
