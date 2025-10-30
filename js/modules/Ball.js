/*
  Ball class
  Represents the bouncing ball in the game
*/


// Ball class
// Represents the bouncing ball in the game

export default class Ball {
  // Create a new ball with position size and speed
  constructor(x = 0, y = 0, size = 10, speed = 4) { // Default values
    this.x = x; // Ball's horizontal position
    this.y = y; // Ball's vertical position
    this.size = size;  // Ball's size (diameter)
    this.speed = speed;  // Ball's speed
    this.dx = speed;      // Horizontal velocity
    this.dy = -speed;     // Vertical velocity
  }

  // Move the ball
  update() {
    this.x += this.dx; // Move horizontally
    this.y += this.dy; // Move vertically
  }

  // Reset ball position
  reset(x, y) {
    this.x = x; // Reset horizontal position
    this.y = y; // Reset vertical position
    this.dx = this.speed; // Reset horizontal velocity
    this.dy = -this.speed; // Reset vertical velocity
  }
}
