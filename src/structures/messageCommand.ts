import { Message, PermissionResolvable } from 'discord.js';
import { ExtendedClient } from '../lib';

export interface MessageCommandRunOptions {
  client: ExtendedClient;
  message: Message;
  args: string[];
}

type RunFunction = (options: MessageCommandRunOptions) => any;

export interface MessageCommandOptions {
  name: string;
  description: string;
  run: RunFunction;
  aliases?: string[];
  category?: string;
  cooldown?: number;
  memberPermission?: PermissionResolvable;
  botPermission?: PermissionResolvable;
}

/**
 * @example <caption>A ping command</caption>
 * export default new MessageCommand({
 *   name: 'ping',
 *   description: 'replies with pong!',
 *   aliases?: ['p'],
 *   category?: 'info',
 *   run: ({ message }) => {
 *     message.reply('Pong!');
 *   },
 * });
 */
export class MessageCommand implements MessageCommandOptions {
  public name!: string;

  public description!: string;

  public run!: RunFunction;

  public aliases?: string[];

  public category?: string;

  public memberPermission?: PermissionResolvable;

  public botPermission?: PermissionResolvable;

  public cooldown?: number;

  constructor(options: MessageCommandOptions) {
    Object.assign(this, options);
  }
}
