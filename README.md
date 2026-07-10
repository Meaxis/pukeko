# Pukeko Framework

*A simple way to organize and register Discord bot commands.*

## What is Pukeko?

Pukeko is a framework designed to simplify Discord bot development by providing a **structured approach to command and interaction registration**.

Instead of managing commands, buttons, modals, and other interactions through large event handlers, Pukeko **automatically discovers and registers handlers** from your project's file structure. This keeps your codebase organized, scalable, and easier to maintain.

When initialized, Pukeko loads all available commands from your `commands` directory and wires up the appropriate interaction handlers (**"processors"**) automatically.

While you are free to interact directly with the Discord.js client, it is recommended to let Pukeko manage all interaction-related logic. In particular, you should avoid handling the `interactionCreate` event yourself, as Pukeko already takes care of interaction routing.

## Getting Started

To use Pukeko, your project should follow this basic structure:

* A Node.js entry file in your project root where your bot starts. This can be as simple as initializing the client, or it can contain additional application logic.
* A `.env` file in the project root containing the configuration values required by Pukeko.
* A `commands` directory in the project root.

The `commands` directory must contain subfolders for organization. Each command should have its own folder, and each interaction processor should be defined in its own JavaScript file.

You may find it useful to organize subfolders by category, or in cases where you have a multi-step flow (e.g. first a slash command, and then a modal). As subfolders are currently purely decorative, it is up to you to decide how to organize them.

Example structure:

```text
project/
├── .env
├── index.js
└── commands/
    ├── ping/
    │   └── command.js
    └── moderation/
        ├── ban.js
        └── kick.js
```

## Command Definition

Every command or interaction processor must export an object containing the following properties:

| Property  | Type                        | Description                                                                                                                                  |
|-----------|-----------------------------|----------------------------------------------------------------------------------------------------------------------------------------------|
| `data`    | `SlashCommandBuilder`       | Defines a slash command that will be registered with Discord.                                                                                |
| `data`    | `ContextMenuCommandBuilder` | Defines a context menu command that will be registered with Discord.                                                                         |
| `data`    | `Object` with `customId`    | Defines an interaction processor (buttons, select menus, modals, etc.). The `customId` is used to route interactions to the correct handler. |
| `execute` | `Function`                  | Function executed when the interaction is triggered. Receives the triggering `interaction` as its first parameter.                           |

### Examples

| Use Case              | `data` Value                      |
|-----------------------|-----------------------------------|
| Slash Command         | `new SlashCommandBuilder()`       |
| Context Menu Command  | `new ContextMenuCommandBuilder()` |
| Button Processor      | `{ customId: "my-button" }`       |
| Modal Processor       | `{ customId: "my-modal" }`        |
| Select Menu Processor | `{ customId: "my-select" }`       |

Example:

```js
module.exports = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Replies with Pong!"),

	async execute(interaction) {
		await interaction.reply("Pong!");
	}
};
```
