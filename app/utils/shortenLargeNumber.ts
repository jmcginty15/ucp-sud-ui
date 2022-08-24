// https://stackoverflow.com/a/28608086
export function shortenLargeNumber(num: number, digits = 1) {
  let units = ["k", "M", "G", "T", "P", "E", "Z", "Y"];
  let decimal;
  for (let i = units.length - 1; i >= 0; i--) {
    decimal = Math.pow(1000, i + 1);
    if (num <= -decimal || num >= decimal) {
      return +(num / decimal).toFixed(digits) + units[i];
    }
  }
  return num;
}
