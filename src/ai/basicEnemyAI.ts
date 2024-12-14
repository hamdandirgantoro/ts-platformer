import { enemy, gameObjects } from "../core/game-objects";
import { canvas } from "../core/canvas";

const player = gameObjects.player;
const minDistance = 200;
interface basicEnemyAI {
  (object: enemy): boolean | void;
}
export const basicEnemyAI: basicEnemyAI = (object: enemy): boolean | void => {
  let distance: number = Math.abs(player.posX - object.posX);
  if (distance > minDistance + object.width) return;
  if (player.posX < object.posX) {
    if (object.posX <= canvas.width - object.width) {
      object.posX += 5;
      return true;
    }
    return true;
  }
  if (player.posX > object.posX + object.width) {
    if (object.posX >= 0) {
      object.posX -= 5;
      return true;
    }
    return true;
  }
};
