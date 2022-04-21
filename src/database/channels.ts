import { dirname } from "@discordx/importer";
import * as fs from "fs";
import path from "path";
import knex from "./knex.js";

export const IDsFilePath = path.join(dirname(import.meta.url), "../../data/IDs.json");
fs.existsSync(path.join(IDsFilePath, "../")) || fs.mkdirSync(path.join(IDsFilePath, "../"));
fs.existsSync(IDsFilePath) || fs.writeFileSync(IDsFilePath, JSON.stringify({ channels: [], configAllowedRoles: [], guilds: [] }));

export async function addChannel(channelId: string) {
  return knex.table("channels").insert({
    channel_discord_id: channelId
  });
}

export async function removeChannel(channelId: string) {
  return knex.table("channels").where({
    channel_discord_id: channelId
  }).delete();
}

export async function getChannelIds(): Promise<string[]> {
  return knex.select("*").from("channels");
}
export async function isRegisteredChannel(channelId: string): Promise<boolean> {
  return (await knex.table("channels").where({
    channel_discord_id: channelId
  })).length > 0;
}