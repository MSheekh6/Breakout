/*
  Game entry point
  Loads the Game class and starts the game
*/

// Import the Game class from the modules folder
import Game from './modules/Game.js';

// Wait for the webpage to finish loading
document.addEventListener('DOMContentLoaded', () => {
  // Find the canvas element where we draw the game
  const canvas = document.getElementById('canvas');
  
  // Create a new game and start it
  const game = new Game(canvas);
  game.start();
});
