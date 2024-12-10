import { canvas, ctx } from "./canvas";
import { gameObjects } from "./game-objects";

class HealthBar {
  private color: string;
  private posX: number;
  private posY: number;
  private height: number;
  private width: number;
  private objectHealth: number;

  constructor(
    color: string,
    posX: number,
    posY: number,
    height: number,
    width: number
  ) {
    this.color = color;
    this.posX = posX;
    this.posY = posY;
    this.height = height;
    this.width = width;
    this.objectHealth = 0;
  }

  public attachTo(gameObject: { health: number }): void {
    this.objectHealth = gameObject.health;
  }

  public draw(): void {
    ctx.fillStyle = "blue";
    ctx.fillRect(this.posX, this.posY, this.width, this.height);
    ctx.fillStyle = this.color;
    // const ObjectHealth: number = (this.objectHealth / 100) * 100;
    if (this.objectHealth! >= 0) {
      ctx.fillRect(this.posX, this.posY, this.objectHealth * 2, this.height);
    }
  }

  public folowObject(): void {}
}

let gameUIRegister = { healthBar: new HealthBar("white", 5, 5, 20, 200) };

export { gameUIRegister as gameUI };
