import "reflect-metadata";
import * as dotenv from "dotenv";

import { dirname, importx } from "@discordx/importer";
import { Intents } from "discord.js";
import { Client } from "discordx";
import { getHorodateConsole } from "./utils/horodatage.js";
import logInteraction from "./utils/logInteraction.js";
import resetPresence from "./utils/resetPresence.js";

export let bot: Client;

dotenv.config({ path: "config/.env" });

function handleExit(signal: NodeJS.Signals) {
    console.info(`${getHorodateConsole()}\t[STOP]\tSignal ${signal} reçu.`);
    bot.user?.setPresence({
        activities: [{ name: "Arrêt en cours", type: "COMPETING" }],
        status: "idle",
    });
    bot.destroy();
    console.log(`${getHorodateConsole()}\t[STOP]\tArrêt du bot.`);
    process.exit(0);
}

process.on("SIGINT", handleExit);
process.on("SIGTERM", handleExit);

function setupBotClient() {
    bot = new Client({
        intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.DIRECT_MESSAGES,
            Intents.FLAGS.DIRECT_MESSAGE_TYPING,
        ],
        silent: false
    });

    bot.once("ready", async () => {
        await bot.guilds.fetch();

        await bot.initApplicationCommands();

        await bot.initApplicationPermissions();

        console.log(`${getHorodateConsole()}\t[INFO]\tReady !`);

        if (bot.user) resetPresence(bot.user);
    });

    bot.on("interactionCreate", (interaction) => {
        console.log(logInteraction(interaction, bot));
        bot.executeInteraction(interaction);
    });
}


async function start() {

    await importx(`${dirname(import.meta.url)}/{events,commands,components}/**/*.{ts,js}`);

    if (!process.env.TOKEN) throw Error("No token found in config/.env file.");

    await bot.login(process.env.TOKEN);
}

export async function restart() {
    console.info(`${getHorodateConsole()}\t[RESTART]\tRédémarrage du bot.`);
    bot.user?.setPresence({
        activities: [{ name: "Redémarrage en cours", type: "COMPETING" }],
        status: "idle",
    });

    bot.destroy();
    setupBotClient();
    await start();
}

setupBotClient();
start();