/*
  Game class
  The main controller that runs the whole game
*/

import Paddle from './Paddle.js';
import Ball from './Ball.js';
import Brick from './Brick.js';

export default class Game {
  // Set up the game
  constructor(canvas) {
    // Canvas setup
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');  // 2D drawing context
    this.canvas.width = 800;
    this.canvas.height = 600;
    
    // Get colors from CSS variables
    const styles = getComputedStyle(document.documentElement);
    this.color = styles.getPropertyValue('--button-color').trim() || '#86a8e7';
    this.secondaryColor = styles.getPropertyValue('--sidebar-color').trim() || '#343457';
    
    // Game state variables
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.isRunning = false;
    
    // Create the paddle at bottom center
    this.paddle = new Paddle(
      this.canvas.width / 2 - 40,  // x position (centered)
      this.canvas.height - 20,  // y position (near bottom)
      80,  // width
      10  // height
    );
    
    // Create the ball at center of canvas
    this.ball = new Ball(
      this.canvas.width / 2,  // x position
      this.canvas.height / 2,  // y position
      10,  // size (radius)
      4  // speed
    );
    
    // Brick settings for grid
    this.brickRowCount = 9;  // 9 columns
    this.brickColumnCount = 5;  // 5 rows
    this.bricks = [];
    this._createBricks();
    
    // Keyboard controls - bind this context
    this._keyDown = this._keyDown.bind(this);
    this._keyUp = this._keyUp.bind(this);
    document.addEventListener('keydown', this._keyDown);
    document.addEventListener('keyup', this._keyUp);
    
    // Connect to HTML elements
    this.scoreEl = document.getElementById('score');
    this.livesEl = document.getElementById('lives');
    
    // Set up rules button functionality
    this._initRulesSidebar();
    
    // Show who's logged in
    this._updateUserInfo();
  }
  
  // Make the rules button work
  _initRulesSidebar() {
    const rulesButton = document.getElementById('rules-btn');
    const closeButton = document.getElementById('close-btn');
    const rules = document.getElementById('rules');
    
    if (rulesButton && closeButton && rules) {
      rulesButton.addEventListener('click', () => rules.classList.add('show'));  // Open sidebar
      closeButton.addEventListener('click', () => rules.classList.remove('show'));  // Close sidebar
    }
  }
  
  // Show who is logged in
  _updateUserInfo() {
    const userInfo = document.getElementById('user-info');
    const logoutBtn = document.getElementById('logout-btn');
    const currentUser = localStorage.getItem('breakout_currentUser');
    
    if (currentUser && userInfo) {
      userInfo.textContent = `Player: ${currentUser}`;
      
      if (logoutBtn) {
        logoutBtn.classList.remove('hidden');  // Show logout button
        logoutBtn.addEventListener('click', () => {
          localStorage.removeItem('breakout_currentUser');  // Clear current user
          this._updateUserInfo();  // Update display
        });
      }
    } else {
      if (userInfo) userInfo.textContent = '';  // Clear user info
      if (logoutBtn) logoutBtn.classList.add('hidden');  // Hide logout button
    }
  }
  
  // Create all the bricks in a grid
  _createBricks() {
    this.bricks = [];
    
    for (let i = 0; i < this.brickRowCount; i++) {
      this.bricks[i] = [];
      for (let j = 0; j < this.brickColumnCount; j++) {
        const x = i * (70 + 10) + 45;  // x position with spacing
        const y = j * (20 + 10) + 60;  // y position with spacing
        this.bricks[i][j] = new Brick(x, y, 70, 20);
      }
    }
  }
  
  // Start the game loop
  start() {
    this.isRunning = true;
    this._loop();
  }
  
  // When you press a key down
  _keyDown(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
      this.paddle.dx = this.paddle.speed;  // Move right
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      this.paddle.dx = -this.paddle.speed;  // Move left
    }
  }
  
  // When you release a key
  _keyUp(e) {
    if (['Right', 'ArrowRight', 'Left', 'ArrowLeft'].includes(e.key)) {
      this.paddle.dx = 0;  // Stop moving
    }
  }
  
  // Update game state every frame
  _update() {
    // Move paddle based on keyboard input
    this.paddle.update(this.canvas.width);
    
    // Move ball based on velocity
    this.ball.update();
    
    // Check if ball hit left or right wall
    if (this.ball.x + this.ball.size > this.canvas.width || 
        this.ball.x - this.ball.size < 0) {
      this.ball.dx *= -1;  // Reverse horizontal direction
    }
    
    // Check if ball hit top wall
    if (this.ball.y - this.ball.size < 0) {
      this.ball.dy *= -1;  // Reverse vertical direction
    }
    
    // Check if ball hit paddle
    if (
      this.ball.x - this.ball.size > this.paddle.x &&
      this.ball.x + this.ball.size < this.paddle.x + this.paddle.w &&
      this.ball.y + this.ball.size > this.paddle.y
    ) {
      this.ball.dy = -Math.abs(this.ball.speed);  // Bounce up
    }
    
    // Check if ball hit any bricks
    this.bricks.forEach(column => {
      column.forEach(brick => {
        if (brick.visible) {
          if (
            this.ball.x - this.ball.size > brick.x &&
            this.ball.x + this.ball.size < brick.x + brick.w &&
            this.ball.y + this.ball.size > brick.y &&
            this.ball.y - this.ball.size < brick.y + brick.h
          ) {
            this.ball.dy *= -1;  // Bounce ball
            brick.visible = false;  // Hide brick
            this._increaseScore();  // Add to score
          }
        }
      });
    });
    
    // Check if ball fell off bottom
    if (this.ball.y + this.ball.size > this.canvas.height) {
      this.lives -= 1;  // Lose a life
      
      if (this.lives <= 0) {
        this._onGameOver();  // Game over
      } else {
        this.ball.reset(this.canvas.width / 2, this.canvas.height / 2);  // Reset ball
        this.paddle.x = this.canvas.width / 2 - this.paddle.w / 2;  // Reset paddle
      }
    }
    
    // Update score and lives display on page
    if (this.scoreEl) this.scoreEl.textContent = String(this.score);
    if (this.livesEl) this.livesEl.textContent = String(this.lives);
  }
  
  // Increase score when brick is hit
  _increaseScore() {
    this.score += 1;
    
    // Check if all bricks are destroyed
    const remainingBricks = this.bricks.flat().filter(b => b.visible).length;
    
    if (remainingBricks === 0) {
      this._nextLevel();  // Move to next level
    }
  }
  
  // Go to next level
  _nextLevel() {
    this.level += 1;
    this._createBricks();  // Create new bricks
    
    // Make ball faster for increased difficulty
    this.ball.speed += 0.5;
    this.ball.dx = Math.sign(this.ball.dx) * this.ball.speed;
    this.ball.dy = -Math.abs(this.ball.speed);
    
    this.ball.reset(this.canvas.width / 2, this.canvas.height / 2);  // Reset position
  }
  
  // Game over - save score and reset
  _onGameOver() {
    const currentUser = localStorage.getItem('breakout_currentUser') || 'Guest';
    
    // Save the score to localStorage
    const scores = JSON.parse(localStorage.getItem('breakout_scores') || '[]');
    
    const scoreEntry = {
      username: currentUser,
      score: this.score,
      date: new Date().toISOString().slice(0, 10)  // YYYY-MM-DD format
    };
    
    scores.push(scoreEntry);
    localStorage.setItem('breakout_scores', JSON.stringify(scores));
    
    // Update top scores if this is a new high score
    const topScores = JSON.parse(localStorage.getItem('breakout_top_scores') || '{}');
    const previousTop = topScores[currentUser] || 0;
    
    if (this.score > previousTop) {
      topScores[currentUser] = this.score;  // Save new high score
      localStorage.setItem('breakout_top_scores', JSON.stringify(topScores));
    }
    
    // Reset the game state
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.ball.speed = 4;  // Reset speed
    this._createBricks();  // Create new bricks
    this.ball.reset(this.canvas.width / 2, this.canvas.height / 2);  // Reset ball
    this.paddle.x = this.canvas.width / 2 - this.paddle.w / 2;  // Reset paddle
  }
  
  // Draw everything on screen
  _draw() {
    // Clear the canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw the ball
    this.ctx.beginPath();
    this.ctx.arc(this.ball.x, this.ball.y, this.ball.size, 0, Math.PI * 2);  // Circle
    this.ctx.fillStyle = this.secondaryColor;
    this.ctx.fill();
    this.ctx.closePath();
    
    // Draw the paddle
    this.ctx.beginPath();
    this.ctx.rect(this.paddle.x, this.paddle.y, this.paddle.w, this.paddle.h);  // Rectangle
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
    this.ctx.closePath();
    
    // Draw all the visible bricks
    this.bricks.forEach(column => {
      column.forEach(brick => {
        if (brick.visible) {
          this.ctx.beginPath();
          this.ctx.rect(brick.x, brick.y, brick.w, brick.h);  // Rectangle
          this.ctx.fillStyle = this.color;
          this.ctx.fill();
          this.ctx.closePath();
        }
      });
    });
  }
  
  // Game loop runs continuously
  _loop() {
    if (!this.isRunning) return;  // Stop if game is paused
    
    this._update();  // Update positions and check collisions
    this._draw();  // Draw everything
    
    requestAnimationFrame(() => this._loop());  // Call this function again next frame
  }
}
