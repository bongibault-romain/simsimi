export const format = (message: string) => {
    return message.replace('`', '').trim().toLowerCase();
};

export const isVoid = (message: string) => {
    return message.replace("*", "").replace("_", "").trim().length == 0;
};

export const hasNitroEmotes = (message: string) => {
  if (message.indexOf(":") + 1 != message.lastIndexOf(":") + 1) {
    return true;
  }

  return false;
};
