import { canvas } from "./canvas";

type keys = Record<string, Record<string, number>>;
type clientMouse = {
  rect: DOMRect;
  mouseX: number;
  mouseY: number;
};

const mouseButton = [
  "leftMouseBtn",
  "middleMouseBtn",
  "rightMouseBtn",
] as const;

type mouseButton = (typeof mouseButton)[number];

type keyParams =
  | mouseButton
  | "KeyW"
  | "KeyA"
  | "KeyS"
  | "KeyD"
  | "Space"
  | "ArrowLeft"
  | "ArrowRight"
  | "ArrowDown"
  | "ArrowUp";

export class Input {
  private keys: keys;
  private clientMouse: clientMouse;

  constructor() {
    this.listenForInput();
    this.keys = {};
    this.clientMouse = {
      rect: canvas.getBoundingClientRect(),
      mouseX: 0,
      mouseY: 0,
    };
  }

  private listenForInput() {
    document.addEventListener("keydown", (ev) => {
      let keys = this.keys[ev.code];
      keys = {
        pressed_at: keys ? keys["pressed_at"] : Date.now(),
        now: Date.now(),
      };
      this.keys[ev.code] = keys;
    });
    document.addEventListener("keyup", (ev) => {
      delete this.keys[ev.code];
    });
    document.addEventListener("mousemove", (ev) => {
      this.clientMouse.rect = canvas.getBoundingClientRect();
      this.clientMouse.mouseX = ev.clientX - this.clientMouse.rect.left;
      this.clientMouse.mouseY = ev.clientY - this.clientMouse.rect.top;
    });
    document.addEventListener("mousedown", (ev) => {
      let keys = this.keys[mouseButton[ev.button]];
      keys = {
        pressed_at: keys ? keys["pressed_at"] : Date.now(),
        now: Date.now(),
      };
      this.keys[mouseButton[ev.button]] = keys;
    });
    document.addEventListener("mouseup", (ev) => {
      delete this.keys[mouseButton[ev.button]];
    });
  }

  public keyPressed(
    keyParams: keyParams,
    duration: number | null = null
  ): boolean {
    const key = keyParams as string;
    if (!this.keys[key]) {
      return false;
    }
    if (
      duration !== null &&
      this.keys[key]["now"] <= this.keys[key]["pressed_at"] + duration
    ) {
      return false;
    }
    return true;
  }

  public getClientMouseProp(): clientMouse {
    return this.clientMouse;
  }
}
