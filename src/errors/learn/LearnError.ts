import { CommandInteraction, Message } from "discord.js";

export default class LearnError extends Error {
  constructor(message: string) {
    super(message);
  }

  async replyToUser(message: Message | CommandInteraction) {
    await message.reply(this.message);
  }
}