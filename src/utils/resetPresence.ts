import { ClientUser } from "discord.js";

export default function resetPresence(user: ClientUser) {
  user.setPresence({ status: "online", activities: [] })
}