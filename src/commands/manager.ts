import GetCommand from "../app/commands/get";
import LearnCommand from "../app/commands/learn";
import SimSimi from "../SimSimi";
import Command from "./command";

export default class CommandManager {

    private commands: Command[] = [];

    constructor(private readonly bot: SimSimi) {}

    public load() {
        this.register(new LearnCommand(this.bot));
        this.register(new GetCommand(this.bot));
    }

    public unload() {
        
    }

    private register(command: Command) {
        this.commands.push(command);
    }

    public exists(name: string): boolean {
        return this.commands.some(command => command.name === name);
    }

    public get(name: string): Command | null {
        return this.commands.find(command => command.name === name) || null;
    }

}