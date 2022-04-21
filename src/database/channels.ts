import { dirname } from "@discordx/importer";
import * as fs from "fs";
import path from "path";


export const IDsFilePath = path.join(dirname(import.meta.url), "../../data/IDs.json");
fs.existsSync(path.join(IDsFilePath, "../")) || fs.mkdirSync(path.join(IDsFilePath, "../"));
fs.existsSync(IDsFilePath) || fs.writeFileSync(IDsFilePath, JSON.stringify({ channels: [], configAllowedRoles: [], guilds: [] }));

export function addChannel(channelId: string) {
  const ids = JSON.parse(fs.readFileSync(IDsFilePath, "utf8"));
  ids.channels.push(channelId);
  fs.writeFileSync(IDsFilePath, JSON.stringify(ids));
}

export function removeChannel(channelId: string) {
  const ids = JSON.parse(fs.readFileSync(IDsFilePath, "utf8"));
  ids.channels = ids.channels.filter((c: string) => c !== channelId);
  fs.writeFileSync(IDsFilePath, JSON.stringify(ids));
}

export function getChannels(): string[] {
  const ids = JSON.parse(fs.readFileSync(IDsFilePath, "utf8"));
  return ids.channels;
}
export function isRegisteredChannel(channelId: string): boolean {
  const ids = JSON.parse(fs.readFileSync(IDsFilePath, "utf8"));
  return ids.channels.includes(channelId);
}