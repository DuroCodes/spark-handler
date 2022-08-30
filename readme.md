# Spark ⚡️

> Spark is a Discord.js v14 command and event handler made in TypeScript.

- This handler supports **events**, **message commands**, and **slash commands**.

### Installation

1. Clone the repository, or download it.
2. Run `npm i` to install dependencies.
3. Rename the `.env.example` file to `.env` and fill in the information.
4. [Run the bot!](#building-and-running)!

### Adding Events

If you would like to add a new event to the bot, create a file in the `src/events` directory with the structure:

```ts
import { Events } from 'discord.js';
import { Event } from '../structures/index.js';

export default new Event({
  event: '<event name> or enum from Events',
  run(/* params */) {
  },
});
```

### Adding Commands

If you would like to add a **slash command** to the bot, create a file in the `src/slashCommands` directory (or sub-folder inside) with the structure:

```ts
import { SlashCommand } from '../structures/index.js';

export default new SlashCommand({
  name: 'ping',
  description: 'replies with pong!',
  async run({ interaction }) {
    interaction.followUp('pong!');
  },
});
```

If you would like to add a **message command** to the bot, create a file in the `src/messageCommands` directory (or sub-folder inside) with the structure:

```ts
import { MessageCommand } from '../structures/index.js';

export default new MessageCommand({
  name: 'ping',
  description: 'replies with pong!',
  async run({ message }) {
    message.reply('pong!');
  },
});
```

*You can use intellisense to see other options for the structure or run function using `ctrl + space`*

### Building and Running

* To test the project using `ts-node` use `npm test`.
* To build the project, run `npm run build`.
* To run the project after compilation, do `npm start`.

---

If you have any **questions**, **issues**, or **suggestions**, dm me on Discord: `Duro#5232`. 
