import {
  CommandInteractionOptionResolver, Events, PermissionsBitField,
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
