import { Client } from "discord.js";
import CommandManager from "./commands/manager";
import ListenerManager from "./listeners/manager";

export default class SimSimi {
    public readonly client: Client;
    public readonly commandManager: CommandManager;
    public readonly listenerManager: ListenerManager;

    constructor() {
        this.client = new Client({
            intents: [
                'GUILDS',
                'GUILD_MESSAGES',
                'DIRECT_MESSAGE_TYPING',
                'DIRECT_MESSAGES'
            ]
        });
        this.listenerManager = new ListenerManager(this);
        this.commandManager = new CommandManager(this);
    }

    public start() {
        this.listenerManager.load();
        this.commandManager.load();

        return this.client.login(process.env.TOKEN);
    }

}