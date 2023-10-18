import Scene from "./scene";
import * as PIXI from 'pixi.js';
import Camera from '../camera/camera';
import Enemies from '../enemy/enemies';
import Players from '../player/players';
import Projectiles from '../projectile/projectiles';
import Vector2 from '../vector2';
import {Weapon} from '../weapon/weapon';
import Ammos from "../ammo/ammos";
import Rooms from "./rooms";

export default class Match extends Scene {
  private shooting = false;

  private container!: PIXI.Container;
  private camera!: Camera;

  private movingUp = false;
  private movingDown = false;
  private movingLeft = false;
  private movingRight = false;

  private playerLifeBar!: PIXI.Graphics;

  private projectiles!: Projectiles;
  private enemies!: Enemies;
  private players!: Players;
  private ammos!: Ammos;

  private weaponId: Weapon = Weapon.PISTOL;
  
  private mousePosition: Vector2 = Vector2.zero();

  private middleText!: PIXI.Text;
  private currentTextLife = 0.0;
  
  private currentPlayer!: any;

  private level!: PIXI.Graphics;

  private ammoText!: PIXI.Text;

  private pistolSprite!: PIXI.Sprite;
  private smgSprite!: PIXI.Sprite;
  private shotgunSprite!: PIXI.Sprite;

  init() {
    this.playerLifeBar = new PIXI.Graphics();

    this.container = new PIXI.Container();

    this.level = new PIXI.Graphics();

    this.level.beginFill(0x000000);
    this.level.drawRect(0, 0, 2000, 2000);

    this.container.addChild(this.playerLifeBar);
    this.container.addChild(this.level);

    this.camera = new Camera();

    this.projectiles = new Projectiles(this.container, this.camera);
    this.enemies = new Enemies(this.container, this.camera);
    this.players = new Players(this.container, this.camera);
    this.ammos = new Ammos(this.container, this.camera);

    this.middleText = new PIXI.Text('Game Over', {
      fontFamily: 'Arial',
      fontSize: 60,
      fill: 0xffffff,
      align: 'justify',
    });

    this.middleText.anchor.set(0.5, 0.5);
    this.container.addChild(this.middleText);

    this.showText("Game Over", 5.0);

    this.ammoText = new PIXI.Text('', {
      fill: 'ffffff',
    });
    this.pistolSprite = PIXI.Sprite.from('src/assets/pistol.png');
    this.smgSprite = PIXI.Sprite.from('src/assets/smg.png');
    this.shotgunSprite = PIXI.Sprite.from('src/assets/shotgun.png');

    this.container.addChild(this.pistolSprite);
    this.container.addChild(this.smgSprite);
    this.container.addChild(this.shotgunSprite);
    this.container.addChild(this.ammoText);
  }

  onMessage(event: MessageEvent) {
    const data = JSON.parse(event.data);
    const { projectiles, players, enemies, player, ammos, wave } = data;

    if (player.weaponId === 1) {
      this.pistolSprite.visible = true;
      this.smgSprite.visible = false;
      this.shotgunSprite.visible = false;
    }
    if (player.weaponId === 2) {
      this.pistolSprite.visible = false;
      this.smgSprite.visible = true;
      this.shotgunSprite.visible = false;
    }
    if (player.weaponId === 3) {
      this.pistolSprite.visible = false;
      this.smgSprite.visible = false;
      this.shotgunSprite.visible = true;
    }

    if (player.deathElapsedTime > 0) {
      this.showText('Game Over', 5);
    }
    if (player.deathElapsedTime > 5 || wave.finished) {
      this.game.changeScene(Rooms);
      return;
    }

    if (wave.currentTime <= 1) {
      this.showText(`Wave ${wave.wave} started!`, 5);
    }

    this.camera.position.x = player.position.x - this.app.renderer.width / 2;
    this.camera.position.y = player.position.y - this.app.renderer.height / 2;

    this.currentPlayer = player;

    this.players.onMessage(players);
    this.projectiles.onMessage(projectiles);
    this.enemies.onMessage(enemies);
    this.ammos.onMessage(ammos);
  }

  update(deltaTime: number) {
    if (!this.currentPlayer) return;

    this.level.position.x = -this.camera.position.x;
    this.level.position.y = -this.camera.position.y;
    this.middleText.position.x = this.app.renderer.width / 2;
    this.middleText.position.y = this.app.renderer.height / 2;

    this.ammoText.text = `${this.currentPlayer.currentAmmo}/${this.currentPlayer.maxAmmo}`;

    this.pistolSprite.position.x = 32;
    this.pistolSprite.position.y = this.app.renderer.height - 128;

    this.smgSprite.position.x = 32;
    this.smgSprite.position.y = this.app.renderer.height - 128;

    this.shotgunSprite.position.x = 32;
    this.shotgunSprite.position.y = this.app.renderer.height - 128;

    this.ammoText.position.x = 32;
    this.ammoText.position.y = this.app.renderer.height - 64;

    const calculatedMousePosition = this.mousePosition.clone();

    calculatedMousePosition.minus(Vector2.from(
      this.app.renderer.width / 2,
      this.app.renderer.height / 2,
    ));

    calculatedMousePosition.sum(Vector2.from(
      this.currentPlayer.position.x,
      this.currentPlayer.position.y,
    ));

    this.webSocket.send(JSON.stringify({
        type: 'PLAYER_MOVE',
        moving: {
          up: this.movingUp,
          down: this.movingDown,
          left: this.movingLeft,
          right: this.movingRight,
        },
        shooting: this.shooting,
        mousePosition: calculatedMousePosition,
        weaponId: this.weaponId,
    }));

    this.currentTextLife -= (deltaTime) / 60;
    if (this.currentTextLife <= 0) {
      this.middleText.text = "";
    }

    this.players.update(deltaTime);
    this.enemies.update(deltaTime);
    this.projectiles.update(deltaTime);
    this.ammos.update(deltaTime);

    this.draw();
  }

  draw() {
    if (this.currentPlayer) {
      this.playerLifeBar.clear();
      this.playerLifeBar.beginFill(0xFF0000);
      this.playerLifeBar.drawRect(16, 1, 100 * (this.currentPlayer?.life / 100), 32);
    }

    this.projectiles.render();
    this.enemies.render();
    this.players.render();
  }

  showText(text: string, life: number) {
    this.middleText.text = text;
    this.currentTextLife = life;
  }

  handleMouseDown = (event: MouseEvent) => {
    if (event.button == 0) {
      this.shooting = true;
    }
  }

  handleMouseUp = (event: MouseEvent) => {
    if (event.button == 0) {
      this.shooting = false;
    }
  }

  handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "1") {
      this.weaponId = Weapon.PISTOL;
    }
    else if (event.key === "2") {
      this.weaponId = Weapon.SMG;
    }
    else if (event.key === "3") {
      this.weaponId = Weapon.SHOTGUN;
    }

    if (event.key === "s") {
      this.movingDown = true;
    }
    else if (event.key === "w") {
      this.movingUp = true;
    }

    if (event.key === "d") {
      this.movingRight = true;
    }
    else if (event.key === "a") {
      this.movingLeft = true;
    }
  }

  handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === "s") {
      this.movingDown = false;
    }

    if (event.key === "w") {
      this.movingUp = false;
    }

    if (event.key === "d") {
      this.movingRight = false;
    }

    if (event.key === "a") {
      this.movingLeft = false;
    }
  }

  input() {
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
    document.addEventListener('mousedown', this.handleMouseDown);
    document.addEventListener('mouseup', this.handleMouseUp);

    window.addEventListener("mousemove", (event) => {
      this.mousePosition.x = event.clientX;
      this.mousePosition.y = event.clientY;
    });
  }

  destroyInput(): void {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
    document.removeEventListener('mousedown', this.handleMouseDown);
    document.removeEventListener('mouseup', this.handleMouseUp);
  }

  getContainer() {
    return this.container;
  }
}
