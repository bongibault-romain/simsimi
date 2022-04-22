export function format(message: string, options?: { toLowerCase: boolean }) {
  let res = message.replaceAll("`", "").trim();
  if (options?.toLowerCase) res = res.toLowerCase();
  return res;
}

export function hasNitroEmotes(message: string) {
  return message.indexOf(":") + 1 !== message.lastIndexOf(":") + 1;
}