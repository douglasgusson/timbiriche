import type Point from "./Point";
import type Line from "./Line";

export default interface Box {
  initialPoint: Point;
  lines: Line[];
}
