import Vector2, {RawVector2} from "../vector2";

export interface PlayerMessage {
  type: 'PLAYER_MOVE' | 'CREATE_ROOM' | 'JOIN_ROOM' | 'LIST_ROOMS';
  shooting?: boolean;
  moving?: {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
  };
  roomId: number;
  weaponId: number;
  mousePosition: RawVector2;
  privateKey: string;
}
