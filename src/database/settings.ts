import fs from "fs";
import path from "path";

export const setSimsimiChannelId = async (
  guildId: string,
  channelId: string | null,
  messageId: string | null
): Promise<void> => {
  const data = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../..", "database.json"), "utf8")
  );
  data.channels[guildId] = channelId;
  data.setupMessages[guildId] = messageId;
  fs.writeFileSync(
    path.join(__dirname, "../..", "database.json"),
    JSON.stringify(data, null, 4),
    "utf8"
  );
};

export const getSimsimiChannelId = async (
  guildId: string
): Promise<string | null> => {
  const data = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../..", "database.json"), "utf8")
  );
  return data.channels[guildId] || null;
};

export const getSimsimiMessageId = async (
  guildId: string
): Promise<string | null> => {
  const data = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../..", "database.json"), "utf8")
  );
  return data.setupMessages[guildId] || null;
};
