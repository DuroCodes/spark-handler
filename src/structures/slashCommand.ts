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
  description: string;
  run: RunFunction;
  category?: string;
  memberPermission?: PermissionResolvable;
  botPermission?: PermissionResolvable;
  requiredRoleId?: string[] | string;
  requiredRoleName?: string[] | string;
  cooldown?: number;
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

  public description!: string;

  public run!: RunFunction;

  public category?: string;

  public memberPermission?: PermissionResolvable;

  public botPermission?: PermissionResolvable;

  public requiredRoleId?: string[] | string;

  public requiredRoleName?: string[] | string;

  public cooldown?: number;

  public options?: ApplicationCommandOptionData[];

  constructor(opt: SlashCommandOptions) {
    Object.assign(this, opt);
  }
}
