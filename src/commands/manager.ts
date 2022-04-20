import { CommandInteraction } from "discord.js";
import GetCommand from "../app/commands/get";
import LearnCommand from "../app/commands/learn";
import SetUpCommand from "../app/commands/setup";
import SimSimi from "../SimSimi";
import Command from "./command";

export default class CommandManager {

    private commands: Command[] = [];

    constructor(private readonly bot: SimSimi) {}

    public load() {
        this.register(new LearnCommand(this.bot));
        this.register(new GetCommand(this.bot));
        this.register(new SetUpCommand(this.bot))
    }

    public unload() {
        
    }

    private register(command: Command) {
        this.commands.push(command);
    }

    public exists(name: string): boolean {
        return this.commands.some(command => command.name === name);
    }

    public get(interaction: CommandInteraction): Command | null {
        return this.commands.find(cmd => cmd.name === interaction.commandName) || null;
    }

}