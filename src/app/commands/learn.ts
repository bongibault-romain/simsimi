import { CommandInteraction, CacheType, Client } from "discord.js";
import Command from "../../commands/command";
import { CommandParameter } from "../../commands/commandParameter";
import learn from "../../utils/learn";

export default class LearnCommand extends Command {
    public get name(): string {
        return 'learn';
    }
    
    public get description(): string {
        return 'Learn a new command';
    }

    public get parameters(): CommandParameter[] {
        return [
            {
                name: 'question',
                type: 'STRING',
                required: true,
                description: 'The question to ask',
            },
            {
                name: 'answer',
                type: 'STRING',
                required: true,
                description: 'The answer to the question',
            }
        ]
    }

    public async run(interaction: CommandInteraction<CacheType>, client: Client<boolean>): Promise<any> {
        const question = interaction.options.getString('question', true);
        const answer = interaction.options.getString('reponse', true);

        return interaction.reply({
            embeds: [
                await learn(question, answer)
            ]
        });
        
    }
}