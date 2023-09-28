import { PlayerConnection, Player } from "./types.js";
import Projectile, {ProjectileGroup, ProjectileType} from "./projectile.js";
import Enemy from "./enemy/enemy.js";
import Midwit from "./enemy/midwit.js";
import Vector2 from "./vector2.js";

export class Room {
  private players: Map<number, PlayerConnection> = new Map();
  private enemies: Map<number, Enemy> = new Map();
  private currentEnemyId = 0;

  private projectiles: Map<number, Projectile> = new Map();
  private unusedProjectileIds: number[] = [];

  private currentTime = 0;

  constructor(public readonly id: number) {
    this.unusedProjectileIds = Array.from(Array(10).keys());
  }

  public createProjectile(projectile: Projectile) {
    if (this.unusedProjectileIds.length === 0) return;

    this.projectiles.set(this.unusedProjectileIds.shift()!, projectile);
  }

  public createEnemy(enemy: Enemy) {
    this.enemies.set(this.currentEnemyId, enemy);
    this.currentEnemyId += 1;
  }

  public addPlayer(playerConnection: PlayerConnection): void {
    this.players.set(playerConnection.player.id, playerConnection);
  }

  public removePlayer(id: number) {
    this.players.delete(id);
  }

  public formatted() {
    return {
      id: this.id,
      players: this.getPlayers(),
    };
  }

  public tick(deltaTime: number) {
    let projectilesObject: { [key: number]: Projectile } = [];
    let enemiesList: Enemy[] = [];

    this.currentTime += deltaTime;

    this.enemies.forEach(enemy => {
      enemy.update(deltaTime);
      enemiesList.push(enemy);
    });

    if (this.currentTime >= 1) {
      this.currentTime = 0;

      this.createEnemy(new Midwit({
        position: Vector2.from(Math.random() * 300, Math.random() * 300),
      }, this.createEnemyContext()));
    }

    [...this.projectiles.keys()].forEach(key => {
      const projectile: Projectile = this.projectiles.get(key)!;

      if (projectile.group === ProjectileGroup.ENEMY) {
        this.checkProjectileCollisionPlayers(projectile);
      }
      else if (projectile.group === ProjectileGroup.PLAYER) {
        this.checkProjectileCollisionEnemies(projectile);
      }

      const { queuedToDeleted, expired } = projectile.update(deltaTime);
      if (expired || queuedToDeleted) {
        this.projectiles.delete(key);
        this.unusedProjectileIds.push(key);
      } else {
        projectilesObject[key] = projectile;
      }
    });

    this.players.forEach(playerConnection => {
      const player = playerConnection.player;
      const socket = playerConnection.socket;

      player.move(deltaTime);

      socket.send(JSON.stringify({
        players: this.getPlayers(),
        player: player,
        projectiles: projectilesObject,
        enemies: enemiesList,
      }));
    });
  }

  private checkProjectileCollisionPlayers(projectile: Projectile) {
    const playersInRange = this.getPlayers().filter(player => player.position.squareDistance(projectile.position) <= projectile.squaredRadius + player.radius);

    playersInRange.forEach(player => player.damage(projectile.damage));
    
    if (playersInRange.length > 0) projectile.queueToDelete();
  }

  private checkProjectileCollisionEnemies(projectile: Projectile) {
    const enemiesInRange = this.getEnemies().filter(enemy => enemy.position.squareDistance(projectile.position) <= projectile.squaredRadius);

    enemiesInRange.forEach(enemy => enemy.damage(projectile.damage));

    if (enemiesInRange.length > 0) projectile.queueToDelete();
  }

  private getEnemies(): Enemy[] {
    const retrievedEnemies: Enemy[] = [];
    this.enemies.forEach(enemy => retrievedEnemies.push(enemy));
    return retrievedEnemies;
  }

  private getPlayers(): Player[] {
    const retrievedPlayers : Player[] = [];
    this.players.forEach(playerConnection => retrievedPlayers.push(playerConnection.player));
    return retrievedPlayers;
  }

  private createEnemyContext() {
    return {
      createProjectile: (projectile: Projectile) => this.createProjectile(projectile),
      getPlayers: () => this.getPlayers(),
    };
  }
}

export class Rooms {
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

  forEach(fn: (room: Room) => void) {
    this.rooms.forEach(fn);
  }
}
