import Room from "./room.js";

export default class Rooms {
  private rooms: Map<number, Room>;
  private currentRoomId = 0;

  constructor() {
    this.rooms = new Map();
  }

  create(): Room {
    const room: Room = new Room(this.currentRoomId);

    this.rooms.set(this.currentRoomId, room);

    this.currentRoomId += 1;

    return room;
  }

  retrieve(id: number): Room | undefined {
    return this.rooms.get(id);
  }

  retrieveAll(): Room[] {
    const roomList: Room[] = [];

    this.rooms.forEach(room => roomList.push(room));

    return roomList;
  }

  update(deltaTime: number) {
    [...this.rooms.entries()].forEach(([key, room]) => { 
      const finished = room.tick(deltaTime);
      if (finished)
        this.rooms.delete(key);
    });
  }
}
