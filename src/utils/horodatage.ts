export function getHorodateConsole(): string {
  const now = new Date();
  return `[${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} - ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}]`;
}