import { canvas, ctx } from "./canvas";

interface GameObjectsInterface {
  color: string;
  posX: number;
  posY: number;
}

class GameObjects implements GameObjectsInterface {
  public color: string;
  public posX: number;
  public posY: number;
  public height: number;
  public width: number;

  constructor(
    color: string,
    posX: number = 0,
    posY: number = 0,
    height: number,
    width: number
  ) {
    this.color = color;
    this.posX = posX;
    this.posY = posY;
    this.height = height;
    this.width = width;
  }
}

class Player extends GameObjects {
  private staticObjects: Array<Platform>;
  public health: number;
  constructor(
    color: string,
    posX: number,
    posY: number,
    height: number,
    width: number
  ) {
    super(color, posX, posY, height, width);
    this.staticObjects = [];
    this.health = 100;
  }

  public checkCollison(staticObjects: Array<Platform>): void {
    this.staticObjects = staticObjects;
    this.staticObjects.forEach((key) => {
      console.log(key);
    });
  }

  public draw(): void {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.posX, this.posY, this.width, this.height);
  }

  public moveX(speed: number): void {
    if (this.posX >= canvas.width - 105) return;
    this.posX += speed;
  }

  public moveY(speed: number): void {
    if (this.posY >= canvas.height) return;
    this.posY += speed;
  }

  public onGround(ground: {
    posX: number;
    posY: number;
    height: number;
    width: number;
  }): boolean {
    if (
      this.posX >= ground.posX - this.height &&
      this.posX <= ground.posX + ground.width &&
      this.posY >= ground.posY - ground.height
    ) {
      return true;
    }
    return false;
  }

  public takeDamage(damage: number): void {
    this.health -= damage;
  }
}

class Bullet extends GameObjects {
  private velocityX: number;
  private velocityY: number;

  constructor(posX: number, posY: number, angle: number, speed: number) {
    const size = 5; // Small white square size
    super("white", posX, posY, size, size);

    // Calculate velocity based on the angle
    this.velocityX = Math.cos(angle) * speed;
    this.velocityY = Math.sin(angle) * speed;
  }

  public update(): void {
    // Move the bullet based on its velocity
    this.posX += this.velocityX;
    this.posY += this.velocityY;
  }

  public draw(): void {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.posX, this.posY, this.width, this.height);
  }

  public isOffScreen(): boolean {
    // Check if the bullet is outside the canvas
    return (
      this.posX + this.width < 0 ||
      this.posX > canvas.width ||
      this.posY + this.height < 0 ||
      this.posY > canvas.height
    );
  }
}

class Weapon extends GameObjects {
  public bullets: Bullet[];
  public damage: number;
  private angle: number;
  private distance: number;
  constructor(
    color: string,
    posX: number,
    posY: number,
    height: number,
    width: number,
    distance: number
  ) {
    super(color, posX, posY, height, width);
    this.bullets = [];
    this.damage = 1;
    this.angle = 0;
    this.distance = distance;
  }

  public draw(): void {
    // Save current canvas state
    ctx.save();

    // Translate to the weapon's center for rotation
    ctx.translate(this.posX + this.width / 2, this.posY + this.height / 2);

    // Rotate canvas by the angle
    ctx.rotate(this.angle);

    // Draw the weapon (resetting its position relative to rotation)
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

    // Restore canvas state
    ctx.restore();
  }

  public update(mouseX: number, mouseY: number): void {
    // Calculate angle to the mouse position
    const player = gameObjectsRegister.player;
    const dx = mouseX - (player.posX + player.width / 2);
    const dy = mouseY - (player.posY + player.height / 2);
    const targetAngle = Math.atan2(dy, dx);

    // Update the weapon's orbit position
    this.angle = targetAngle;
    this.posX =
      player.posX +
      player.width / 2 +
      Math.cos(this.angle) * this.distance -
      this.width / 2;
    this.posY =
      player.posY +
      player.height / 2 +
      Math.sin(this.angle) * this.distance -
      this.height / 2;
  }

  public stickToPlayer(): void {
    this.posX = gameObjectsRegister.player.posX + 120;
    this.posY = gameObjectsRegister.player.posY + 40;
  }

  public shoot(): void {
    const bulletSpeed = 10;

    // Calculate bullet start position (from the tip of the weapon)
    const startX = this.posX + this.width / 2 + Math.cos(this.angle) * 50;
    const startY = this.posY + this.height / 2 + Math.sin(this.angle) * 50;

    // Create a new bullet and add it to the array
    const bullet = new Bullet(startX, startY, this.angle, bulletSpeed);
    this.bullets.push(bullet);
  }
}

class Platform extends GameObjects {
  public height: number;
  public width: number;

  constructor(
    color: string,
    posX: number,
    posY: number,
    height: number,
    width: number
  ) {
    super(color, posX, posY, height, width);
    this.height = height;
    this.width = width;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.posX, this.posY, this.width, this.height);
  }
}

class enemy extends GameObjects {
  damage: number;
  health: number;

  constructor(
    color: string,
    posX: number,
    posY: number,
    height: number,
    width: number
  ) {
    super(color, posX, posY, height, width);
    this.damage = 10;
    this.health = 100;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.posX, this.posY, this.width, this.height);
  }
}

let platformPosY: number = 600;
let playerPosX: number = canvas.width * 0.5 - 50;

let gameObjectsRegister = {
  platform: new Platform("green", 0, platformPosY, 100, 2000) as Platform,
  player: new Player(
    "white",
    playerPosX,
    platformPosY - 100,
    100,
    100
  ) as Player,
  weapon: new Weapon(
    "white",
    playerPosX + 120,
    platformPosY - 60,
    20,
    80,
    120
  ) as Weapon,
  enemy: new enemy("blue", playerPosX + 400, platformPosY - 100, 100, 100),
};

export { gameObjectsRegister as gameObjects };
