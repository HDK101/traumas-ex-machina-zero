import Polygon from "./polygon";

export interface Enemy {
  life: number;
  x: number;
  y: number;
  polygon: Polygon;
}
