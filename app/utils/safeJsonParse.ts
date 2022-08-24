export function safeJsonParse(x: any) {
  try {
    return JSON.parse(x);
  } catch (e) {
    return null;
  }
}
