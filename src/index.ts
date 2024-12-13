import { input } from "./core/input";
import { canvas, ctx } from "./core/canvas";
import { gameObjects } from "./core/game-objects";
import { gameUI } from "./core/game-ui";

const gravity = 2800;
let velocity: number = 0;
let time_step: number = 0.016;
let isJumping: boolean = false;
let jumpEnergy: number = -1200;

const loop = () => {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  gameObjects.player.draw();
  gameObjects.enemy.draw();
  gameObjects.weapon.draw();
  if (!gameObjects.player.onGround(gameObjects.platform) && !isJumping) {
    velocity += gravity * time_step;
    gameObjects.player.moveY(velocity * time_step);
  } else {
    if (isJumping) {
      velocity += gravity * time_step;
      gameObjects.player.moveY(velocity * time_step);
      isJumping = velocity >= 0 ? false : true;
    } else {
      gameObjects.player.posY = gameObjects.platform.posY - 100;
      velocity = 0;
    }
  }
  gameObjects.platform.draw();
  if (input.keyPressed("leftMouseBtn")) gameObjects.weapon.shoot();
  if (input.keyPressed("ArrowRight") || input.keyPressed("KeyD"))
    gameObjects.player.posX += 10;
  if (input.keyPressed("ArrowLeft") || input.keyPressed("KeyA"))
    gameObjects.player.posX -= 10;
  if (input.keyPressed("Space") || input.keyPressed("KeyW")) {
    if (gameObjects.player.onGround(gameObjects.platform)) {
      velocity = jumpEnergy;
      isJumping = true;
    }
  }
  gameObjects.weapon.bullets.forEach((bullet, index) => {
    bullet.update();
    bullet.draw();
    if (
      bullet.posX >= gameObjects.enemy.posX - 10 &&
      bullet.posX <= gameObjects.enemy.posX + gameObjects.enemy.width + 10 &&
      bullet.posY >= gameObjects.enemy.posY - 10 &&
      bullet.posY <= gameObjects.enemy.posY + gameObjects.enemy.height + 10
    ) {
      gameObjects.enemy.health -= gameObjects.weapon.damage;
      gameObjects.weapon.bullets.splice(index, 1);
    }
    if (bullet.isOffScreen()) {
      gameObjects.weapon.bullets.splice(index, 1);
    }
  });
  let clientMouse = input.getClientMouseProp();
  gameObjects.weapon.update(clientMouse.mouseX, clientMouse.mouseY);
  gameUI.healthBar.attachTo(gameObjects.player, 0);
  gameUI.healthBar.draw();
  gameUI.healthBar.attachTo(gameObjects.enemy, 1, true);
  gameUI.healthBar.draw();
  requestAnimationFrame(loop);
};
requestAnimationFrame(loop);
