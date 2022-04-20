export const format = (message: string, toLowerCase: boolean = true) => {
    if (toLowerCase) {
      return message.replace('`', '').trim().toLowerCase()
    } else {
      return message.replace('`', '').trim()
    }
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
