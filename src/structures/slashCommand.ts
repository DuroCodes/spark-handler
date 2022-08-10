import {
  ApplicationCommandOptionData,
  ChatInputApplicationCommandData, CommandInteraction,
  CommandInteractionOptionResolver,
  PermissionResolvable,
} from 'discord.js';
import { ExtendedClient } from '../lib';

export interface SlashCommandRunOptions {
  client: ExtendedClient;
  interaction: CommandInteraction;
  args: CommandInteractionOptionResolver;
}

type RunFunction = (options: SlashCommandRunOptions) => any;

export type SlashCommandOptions = {
  name: string;
  category?: string;
  description: string;
  run: RunFunction;
  memberPermission?: PermissionResolvable;
  botPermission?: PermissionResolvable;
  options?: ApplicationCommandOptionData[];
} & ChatInputApplicationCommandData;

/**
 * @example <caption>A ping command</caption>
 * export default new SlashCommand({
 *   name: 'ping',
 *   description: 'replies with pong',
 *   category?: 'info',
 *   run({ interaction }) {
 *     interaction.reply('Pong!');
 *   },
 * });
 */
export class SlashCommand implements SlashCommandOptions {
  public name!: string;

  public category?: string;

  public description!: string;

  public run!: RunFunction;

  public memberPermission?: PermissionResolvable;

  public botPermission?: PermissionResolvable;

  public options?: ApplicationCommandOptionData[];

  constructor(opt: SlashCommandOptions) {
    Object.assign(this, opt);
  }
}
