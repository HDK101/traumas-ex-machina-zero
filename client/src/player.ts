import Polygon from "./polygon";

export interface Player {
  life: number;
  x: number;
  y: number;
  polygon: Polygon;
}
