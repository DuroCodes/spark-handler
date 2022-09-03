import {
  CommandInteraction, PermissionResolvable, EmbedBuilder, SelectMenuInteraction, Message,
} from 'discord.js';
import { emoji } from './emoji.js';
import { client } from '../index.js';

export interface EmbedGeneratorOptions {
  interaction?: CommandInteraction | SelectMenuInteraction;
  message?: Message;
}

export interface PermissionErrorOptions extends EmbedGeneratorOptions {
  permission: PermissionResolvable;
  user: 'I' | 'You';
}

export interface BasicEmbedOptions extends EmbedGeneratorOptions {
  reason: string;
}

export type PunishmentEmbedOptions = {
  type: 'Ban' | 'Kick' | 'Unban';
  reason?: string;
  user: string;
} & Omit<BasicEmbedOptions, 'reason'>;

export const embedGenerator = {
  permissionError({
    interaction, permission, user, message,
  }: PermissionErrorOptions) {
    const embed = new EmbedBuilder()
      .setTitle(`${emoji.wrong} Permission Error`)
      .setColor('Red')
      .setDescription(`${user} do not have the \`${permission}\` permission`);

    if (interaction) return interaction.followUp({ embeds: [embed] });
    if (message) return message.reply({ embeds: [embed] });
    return client.logger.warn('The function requires you to supply an interaction or message!');
  },

  error({ interaction, reason, message }: BasicEmbedOptions) {
    const embed = new EmbedBuilder()
      .setTitle(`${emoji.wrong} Error`)
      .setColor('Red')
      .setDescription(reason);

    if (interaction) return interaction.followUp({ embeds: [embed] });
    if (message) return message.reply({ embeds: [embed] });
    return client.logger.warn('The function requires you to supply an interaction or message!');
  },

  success({ interaction, reason, message }: BasicEmbedOptions) {
    const embed = new EmbedBuilder()
      .setTitle(`${emoji.correct} Success`)
      .setColor('Green')
      .setDescription(reason);

    if (interaction) return interaction.followUp({ embeds: [embed] });
    if (message) return message.reply({ embeds: [embed] });
    return client.logger.warn('The function requires you to supply an interaction or message!');
  },

  punishment({
    interaction, type, reason, user, message,
  }: PunishmentEmbedOptions) {
    const map = {
      Unban: 'unbanned',
      Kick: 'kicked',
      Ban: 'banned',
    };

    const embed = new EmbedBuilder()
      .setTitle(`${emoji.ban} ${type}`)
      .setColor('Red')
      .setDescription(`**${user}** has been ${map[type]}${reason ? `for ${reason}` : ''}!`);

    if (interaction) return interaction.followUp({ embeds: [embed] });
    if (message) return message.reply({ embeds: [embed] });
    return client.logger.warn('The function requires you to supply an interaction or message!');
  },
};
