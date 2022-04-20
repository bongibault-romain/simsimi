import InteractionCreate from "../app/listeners/interactionCreate";
import MessageCreate from "../app/listeners/messageCreate";
import Ready from "../app/listeners/ready";
import SimSimi from "../SimSimi";
import Listener from "./listener";

export default class ListenerManager {

    constructor(private readonly bot: SimSimi) {}

    public load() {
        this.register(new Ready(this.bot));
        this.register(new InteractionCreate(this.bot));
        this.register(new MessageCreate(this.bot));
    }

    public unload() {
        
    }

    private register(listener: Listener<any>) {
        this.bot.client.on(listener.name, async (...args) => listener.run(...args));
    }

}