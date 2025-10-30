/*
  Brick class
  Represents one brick that you try to break
*/

export default class Brick {
  // Create a new brick with position and size
  constructor(x, y, w = 70, h = 20) { // Default values
    this.x = x; // Brick's horizontal position
    this.y = y; // Brick's vertical position
    this.w = w; // Brick's Width
    this.h = h; // Brick's Height
    this.visible = true;     // Is the brick still there?
  }
}
