export function safeDateTimeFormat(
  value: string | number | Date,
  formatter: Intl.DateTimeFormat
) {
  let out: string | null = null;
  try {
    out = formatter.format(new Date(value));
  } catch (e) {}
  return out;
}
