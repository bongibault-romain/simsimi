import { Client, CommandInteraction } from "discord.js";
import SimSimi from "../SimSimi";
import { CommandParameter } from "./commandParameter";

export default abstract class Command {
  constructor(protected readonly bot: SimSimi) {}

  public abstract get name(): string;

  public abstract get description(): string;

  public abstract get parameters(): CommandParameter[];

  public abstract run(
    interaction: CommandInteraction,
    client: Client
  ): Promise<any>;
}
