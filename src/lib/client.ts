import chalk from 'chalk';
import {
  ApplicationCommandDataResolvable,
  Client, ClientEvents, ClientOptions, Collection, Routes,
} from 'discord.js';
import glob from 'glob';
import { promisify } from 'util';
import { Event, MessageCommand } from '../structures';
import { env } from './env';
import { logger } from '.';
import { SlashCommand } from '../structures/slashCommand';

const globPromise = promisify(glob);

export interface ExtendedClientOptions extends ClientOptions {
  loggingEnabled?: boolean;
}

class LoggerClient extends Client {
  public logger = logger;
}

export class ExtendedClient extends LoggerClient {
  public messageCommands: Collection<string, MessageCommand> = new Collection();

  public messageCommandAliases: Collection<string, MessageCommand> = new Collection();

  public slashCommands: Collection<string, SlashCommand> = new Collection();

  public loggingEnabled?: boolean;

  constructor(options: ExtendedClientOptions) {
    super({ ...options });
    Object.assign(this, options);
  }

  start() {
    this.login(env.BOT_TOKEN);
    this.registerModules();
  }

  async importFile(filePath: string) {
    return (await import(filePath))?.default;
  }

  async registerModules() {
    await this.registerEvents();
    await this.registerMessageCommands();
    await this.registerSlashCommands();
  }

  async registerEvents() {
    const eventFiles = await globPromise(`${__dirname}/../events/**/*{.ts,.js}`);
    eventFiles.forEach(async (path) => {
      const event: Event<keyof ClientEvents> = await this.importFile(path);
      if (!event.event || !event.run) return logger.warn('An event is missing a name or a run function!');
      if (this.loggingEnabled) logger.info(`${chalk.bold(event.event)} event loaded!`);
      this.on(event.event, event.run);
    });
  }

  async registerMessageCommands() {
    const commandFiles = await globPromise(`${__dirname}/../messageCommands/**/*{.ts,.js}`);

    commandFiles.forEach(async (path) => {
      const command: MessageCommand = await this.importFile(path);
      if (!command.name || !command.run) return logger.warn('A message command is missing a name, description, or a run function!');
      if (this.loggingEnabled) logger.info(`${chalk.bold(command.name)} message command loaded!`);
      this.messageCommands.set(command.name, command);
      if (command.aliases) {
        command.aliases.forEach((alias) => {
          this.messageCommandAliases.set(alias, command);
        });
      }
    });
  }

  async registerSlashCommands() {
    const slashCommands: ApplicationCommandDataResolvable[] = [];
    const commandFiles = await globPromise(`${__dirname}/../slashCommands/**/*{.ts,.js}`);

    commandFiles.forEach(async (path) => {
      const command: SlashCommand = await this.importFile(path);
      if (!command.name || !command.description || !command.run) return logger.warn('A slash command is missing a name, description, or run function!');
      if (this.loggingEnabled) logger.info(`${chalk.bold(command.name)} slash command loaded!`);
      this.slashCommands.set(command.name, command);
      slashCommands.push(command);

      try {
        await this.rest.put(Routes.applicationCommands(env.CLIENT_ID), {
          body: slashCommands,
        });

        logger.info('Registered all slash commands!');
      } catch (e) {
        logger.error(e);
      }
    });
  }
}
