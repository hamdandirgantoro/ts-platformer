import { canvas, ctx } from "./canvas";

class HealthBar {
  private color: string;
  private posX: number;
  private posY: number;
  private height: number;
  private width: number;
  private objectHealth: number;
  private gameObjects: Array<{
    id: number;
    health: number;
    posX: number;
    posY: number;
    followObject: boolean;
  }>;

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
    this.gameObjects = [];
  }

  public attachTo(
    gameObject: { health: number; posX: number; posY: number },
    id: number,
    followObject: boolean = false
  ): void {
    this.objectHealth = gameObject.health;
    const objectExistInArray = this.gameObjects.find((item) => item.id == id);
    if (objectExistInArray) {
      // objectExistInArray.followObject = followObject;
      objectExistInArray.health = gameObject.health;
      objectExistInArray.posX = gameObject.posX;
      objectExistInArray.posY = gameObject.posY;
      return;
    }
    this.gameObjects.push({ ...gameObject, id, followObject });
  }

  public draw(): void {
    this.gameObjects.forEach((gameObject) => {
      if (gameObject.followObject) {
        let posX = gameObject.posX - 50;
        let posY = gameObject.posY - 50;
        ctx.fillStyle = "blue";
        ctx.fillRect(posX, posY, this.width, this.height);
        ctx.fillStyle = this.color;
        if (gameObject.health! >= 0) {
          ctx.fillRect(posX, posY, gameObject.health * 2, this.height);
        }
      } else {
        ctx.fillStyle = "blue";
        ctx.fillRect(this.posX, this.posY, this.width, this.height);
        ctx.fillStyle = this.color;
        if (gameObject.health! >= 0) {
          ctx.fillRect(
            this.posX,
            this.posY,
            gameObject.health * 2,
            this.height
          );
        }
      }
    });
  }

  public detachFromObject(id: number): void {
    const index = this.gameObjects.findIndex((item) => item.id == id);
    this.gameObjects.splice(index, 1);
  }

  // public folowObject(gameObject: {
  //   posX: number;
  //   posY: number;
  //   height: number;
  //   width: number;
  // }): void {
  //   this.posX = gameObject.posX - 50;
  //   this.posY = gameObject.posY - 50;
  // }
}

let gameUIRegister = { healthBar: new HealthBar("white", 5, 5, 20, 200) };

export { gameUIRegister as gameUI };
