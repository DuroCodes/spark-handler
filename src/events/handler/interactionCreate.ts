import { CommandInteractionOptionResolver, Events } from 'discord.js';
import { client } from '../..';
import { Event } from '../../structures';

export default new Event({
  event: Events.InteractionCreate,
  async run(interaction) {
    if (interaction.isChatInputCommand()) {
      await interaction.deferReply();
      const command = client.slashCommands.get(interaction.commandName);
      if (!command) return interaction.followUp('This command does not exist!');

      return command.run({
        interaction,
        args: interaction.options as CommandInteractionOptionResolver,
        client,
      });
    }
  },
});
