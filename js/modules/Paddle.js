/*
  Paddle class
  The paddle at the bottom that the player controls with arrow keys
*/

export default class Paddle {
  // Create a new paddle with position and size
  constructor(x, y, w = 80, h = 10) { // Default values
    this.x = x; // Paddle's horizontal position
    this.y = y; // Paddle's vertical position
    this.w = w; // Paddle's width
    this.h = h; // Paddle's height
    this.speed = 8; // Paddle's speed
    this.dx = 0;        // Velocity (0=stopped +right -left)
  }

  // Move the paddle and keep it on screen
  update(canvasWidth) {
    this.x += this.dx; // Move paddle horizontally
    
    // Don't go off right edge
    if (this.x + this.w > canvasWidth) {
      this.x = canvasWidth - this.w; // Keep paddle inside the canvas from the right
    }
    
    // Don't go off left edge
    if (this.x < 0) {
      this.x = 0; // Keep paddle inside the canvas from the left
    }
  }
}
