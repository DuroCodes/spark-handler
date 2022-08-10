import { ClientEvents } from 'discord.js';

export interface EventOptions<Key extends keyof ClientEvents> {
  event: Key;
  once?: boolean;
  run: (...args: ClientEvents[Key]) => any;
}

export class Event<Key extends keyof ClientEvents> implements EventOptions<Key> {
  event!: Key;

  run!: (...args: ClientEvents[Key]) => any;

  once?: boolean;

  constructor(options: EventOptions<Key>) {
    Object.assign(this, options);
  }
}
