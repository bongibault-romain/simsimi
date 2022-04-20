import {
  CommandInteraction,
  CacheType,
  Client,
  MessageEmbed,
} from "discord.js";
import Command from "../../commands/command";
import { CommandParameter } from "../../commands/commandParameter";
import { strictExists, get, exists } from "../../database/sentences";
import { format, isVoid } from "../../utils/format";
import learn from "../../utils/learn";

export default class GetCommand extends Command {
  public get name(): string {
    return "get";
  }

  public get description(): string {
    return "Learn a new command";
  }

  public get parameters(): CommandParameter[] {
    return [
      {
        name: "question",
        type: "STRING",
        required: true,
        description: "The question to ask",
      },
    ];
  }

  public async run(
    interaction: CommandInteraction<CacheType>,
    client: Client<boolean>
  ): Promise<any> {
    const question = format(interaction.options.getString("question", true));

    if (isVoid(question)) {
      throw new MessageEmbed(
        new MessageEmbed()
          .setTitle("Oups !")
          .setColor("#cc0000")
          .setDescription(
            "Ta question est vide !" +
              "\n" +
              "Je ne peux pas avoir rien appris..."
          )
      );
    }

    if (question.length > process.env.MAX_LENGTH) {
      interaction.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Oups !")
            .setColor("#cc0000")
            .setDescription(
              [
                "Ta question est trop longue." +
                  "\n" +
                  "Je ne peux pas apprendre de phrase qui dépasse les **",
                process.env.MAX_LENGTH,
                "** caractères !",
              ].join("")
            ),
        ],
      });
    }

    if (!(await exists(question))) {
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Oups !")
            .setColor("#cc0000")
            .setDescription(
              "Cette question n'est pas présente dans ma mémoire."
            ),
        ],
      });
    }

    return interaction.reply({
      embeds: [
        new MessageEmbed()
          .setTitle(['La question "**', question, '**" est liée à :'].join(""))
          .setColor("#3366ff")
          .setDescription((await get(question)).join("")),
      ],
    });
  }
}
