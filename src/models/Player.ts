import type Box from "./Box";

export default interface Player {
  id: string;
  name: string;
  color: string;
  boxes: Box[];
}
