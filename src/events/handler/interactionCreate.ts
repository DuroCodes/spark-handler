import {
  CommandInteractionOptionResolver, Events, PermissionsBitField,
} from 'discord.js';
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
