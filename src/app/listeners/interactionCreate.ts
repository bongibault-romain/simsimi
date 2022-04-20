import { Interaction, CacheType } from "discord.js";
import Listener from "../../listeners/listener";

export default class InteractionCreate extends Listener<'interactionCreate'> {
    
    public get name(): "interactionCreate" {
        return 'interactionCreate'
    }

    public async run(interaction: Interaction<CacheType>): Promise<any> {
        if(interaction.isCommand()) {
            const command = this.bot.commandManager.get(interaction.commandName);
            
            if(command != null) {
                await command.run(interaction, this.bot.client);
            }

        }
    }

}