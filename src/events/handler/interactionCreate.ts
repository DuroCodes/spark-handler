import {
  CommandInteractionOptionResolver, Events, GuildMemberRoleManager, PermissionsBitField,
} from 'discord.js';
import ms from 'ms';
import { client } from '../..';
import { Event } from '../../structures';

export default new Event({
  event: Events.InteractionCreate,
  async run(interaction) {
    if (interaction.isChatInputCommand()) {
      await interaction.deferReply();
      const command = client.slashCommands.get(interaction.commandName);
      if (!command) return;

      if (
        command.memberPermission
        && !(
          (interaction.member?.permissions as PermissionsBitField).has(command.memberPermission)
        )
      ) return client.embeds.permissionError({ interaction, permission: command.memberPermission, user: 'You' });

      if (
        command.botPermission
        && !(
          (interaction.guild?.members.me?.permissions.has(command.botPermission))
        )
      ) return client.embeds.permissionError({ interaction, permission: command.botPermission, user: 'I' });

      if (command.requiredRoleId) {
        if (command.requiredRoleId instanceof Array
          && !(command.requiredRoleId.some(
            (x) => (interaction.member?.roles as GuildMemberRoleManager).cache.has(x),
          ))
        ) {
          const requiredRoles = command.requiredRoleId.map(
            (x) => interaction.guild?.roles.cache.get(x),
          ).filter((x) => x);

          if (!requiredRoles.length) {
            client.logger.warn(`Could not find required role ids: ${command.requiredRoleId}`);
            return client.embeds.error({
              interaction,
              reason: `An error occurred while trying to find the required role(s).\n\n**Required Role(s):** \`${command.requiredRoleId.join(', ')}\``,
            });
          }

          return client.embeds.error({
            interaction,
            reason: `You do not have the required role(s) to use this command.\n\n**Required Roles ID(s):** \`${requiredRoles.map((x) => x?.name).join(', ')}\``,
          });
        }

        if (
          !(command.requiredRoleId instanceof Array)
          && !((interaction.member?.roles as GuildMemberRoleManager)
            .cache.has(command.requiredRoleId as string))
        ) {
          const requiredRole = interaction.guild?.roles.cache.get(command.requiredRoleId as string);

          if (!requiredRole) {
            client.logger.warn(`Could not find required role id: ${command.requiredRoleId}`);
            return client.embeds.error({
              interaction,
              reason: `An error occurred while trying to find the required role.\n\n**Required Role ID:** \`${command.requiredRoleId}\``,
            });
          }

          return client.embeds.error({
            interaction,
            reason: `You do not have the required role to use this command.\n\n**Required Role:** \`${requiredRole?.name}\`\n**Role ID:** \`${requiredRole?.id}\``,
          });
        }
      }

      if (command.requiredRoleName) {
        if (command.requiredRoleName instanceof Array
          && !(command.requiredRoleName.some(
            (x) => (
              interaction.member?.roles as GuildMemberRoleManager).cache.some((y) => y.name === x),
          ))
        ) {
          const requiredRoles = command.requiredRoleName.map(
            (x) => interaction.guild?.roles.cache.find((y) => y.name === x),
          ).filter((x) => x);

          if (!requiredRoles.length) {
            client.logger.warn(`Could not find required role names: ${command.requiredRoleName}`);
            return client.embeds.error({
              interaction,
              reason: `An error occurred while trying to find the required role(s).\n\n**Required Role(s):** \`${command.requiredRoleName.join(', ')}\``,
            });
          }

          return client.embeds.error({
            interaction,
            reason: `You do not have the required role(s) to use this command.\n\n**Required Role(s):** \`${requiredRoles.map((x) => x?.name).join(', ')}\``,
          });
        }

        if (
          !(command.requiredRoleName instanceof Array)
          && !((interaction.member?.roles as GuildMemberRoleManager).cache.some(
            (x) => x.name === command.requiredRoleName,
          ))
        ) {
          const requiredRole = interaction.guild?.roles.cache.find(
            (x) => x.name === command.requiredRoleName,
          );
          if (!requiredRole) {
            client.logger.warn(`Could not find required role name: ${command.requiredRoleName}`);
            return client.embeds.error({
              interaction,
              reason: `An error occurred while trying to find the required role.\n\n**Required Role:** \`${command.requiredRoleName}\``,
            });
          }

          return client.embeds.error({
            interaction,
            reason: `You do not have the required role to use this command.\n\n**Required Role:** \`${requiredRole?.name}\`\n**Role ID:** \`${requiredRole?.id}\``,
          });
        }
      }

      if (command.cooldown) {
        const timeout = `${command.name}${interaction.user.id}`;

        if (client.slashCommandCooldowns.has(timeout)) {
          return client.embeds.error({
            reason: `You are on a \`${ms(client.slashCommandCooldowns.get(timeout) as number - Date.now(), { long: true })}\` timeout`,
            interaction,
          });
        }

        try {
          await command.run({
            interaction,
            args: interaction.options as CommandInteractionOptionResolver,
            client,
          });

          client.slashCommandCooldowns.set(timeout, Date.now() + command.cooldown);

          return setTimeout(() => {
            client.slashCommandCooldowns.delete(timeout);
          }, command.cooldown);
        } catch (e: any) {
          client.logger.error(e.stack);
          return client.embeds.error({ interaction, reason: `An error occured while running the command.\n\`\`\`sh\n${e}\`\`\`` });
        }
      }

      try {
        return await command.run({
          interaction,
          args: interaction.options as CommandInteractionOptionResolver,
          client,
        });
      } catch (e: any) {
        client.logger.error(e.stack);
        return client.embeds.error({ interaction, reason: `An error occured while running the command.\n\`\`\`sh\n${e}\`\`\`` });
      }
    }
  },
});
