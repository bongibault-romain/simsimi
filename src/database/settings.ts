import { dirname } from "@discordx/importer";
import * as fs from "fs";
import path from "path";

const IDsFilePath = path.join(dirname(import.meta.url), "../../data/IDs.json");

console.log(path.join(IDsFilePath, "../"));

fs.existsSync(path.join(IDsFilePath, "../")) || fs.mkdirSync(path.join(IDsFilePath, "../"));
fs.existsSync(IDsFilePath) || fs.writeFileSync(IDsFilePath, JSON.stringify({ channels: [], guilds: [] }));

export async function addChannel(channelId: string) {
    const ids = JSON.parse(fs.readFileSync(IDsFilePath, "utf8"));
    ids.channels.push(channelId);
    fs.writeFileSync(IDsFilePath, JSON.stringify(ids));
}

export async function removeChannel(channelId: string) {
    const ids = JSON.parse(fs.readFileSync(IDsFilePath, "utf8"));
    ids.channels = ids.channels.filter((c: string) => c !== channelId);
    fs.writeFileSync(IDsFilePath, JSON.stringify(ids));
}

export async function getChannels() {
    const ids = JSON.parse(fs.readFileSync(IDsFilePath, "utf8"));
    return ids.channels;
}

export async function addGuild(guildId: string) {
    const ids = JSON.parse(fs.readFileSync(IDsFilePath, "utf8"));
    ids.guilds.push(guildId);
    fs.writeFileSync(IDsFilePath, JSON.stringify(ids));
}

export async function removeGuild(guildId: string) {
    const ids = JSON.parse(fs.readFileSync(IDsFilePath, "utf8"));
    ids.guilds = ids.guilds.filter((g: string) => g !== guildId);
    fs.writeFileSync(IDsFilePath, JSON.stringify(ids));
}

export async function getGuilds() {
    const ids = JSON.parse(fs.readFileSync(IDsFilePath, "utf8"));
    return ids.guilds;
}

export async function isRegisteredGuild(guildId: string) {
    const ids = JSON.parse(fs.readFileSync(IDsFilePath, "utf8"));
    return ids.guilds.includes(guildId);
}

export async function isRegisteredChannel(channelId: string) {
    const ids = JSON.parse(fs.readFileSync(IDsFilePath, "utf8"));
    return ids.channels.includes(channelId);
}