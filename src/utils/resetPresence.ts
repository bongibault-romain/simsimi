import { ClientUser } from "discord.js";

export default function resetPresence(user: ClientUser) {
  user.setPresence({
    activities: [
      {
        name: "vos messages !",
        type: "LISTENING",
      }
    ],
    status: "online",
  });
}