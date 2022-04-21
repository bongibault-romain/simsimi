export function format(message: string, options?: { toLowerCase: boolean }) {
  let res = message.replace("`", "").trim();
  if (options?.toLowerCase) res = res.toLowerCase();
  return res;
}