import { Client, ClientEvents } from "discord.js";
import SimSimi from "../SimSimi";

export default abstract class Listener<T extends keyof ClientEvents> {

    constructor(protected readonly bot: SimSimi) {}

    public abstract get name(): T;

    public abstract run(...args: ClientEvents[T]): Promise<any>;

}