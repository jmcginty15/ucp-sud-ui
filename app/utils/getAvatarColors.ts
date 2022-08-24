import ColorHash from "color-hash-ts";
import { isColorLight } from "./isColorLight";

const colorHash = new ColorHash();

export function getAvatarColors(userUuid: string) {
  const backgroundColor = colorHash.hex(userUuid);
  const color = isColorLight(backgroundColor) ? "black" : "white";
  return { backgroundColor, color };
}
