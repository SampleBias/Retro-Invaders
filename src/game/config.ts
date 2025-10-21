// Canvas dimensions
export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;
// Player configuration
export const PLAYER_WIDTH = 40;
export const PLAYER_HEIGHT = 20;
export const PLAYER_START_Y = CANVAS_HEIGHT - PLAYER_HEIGHT - 20;
export const PLAYER_SPEED = 5;
export const PLAYER_LIVES = 3;
// Laser configuration
export const LASER_WIDTH = 4;
export const LASER_HEIGHT = 15;
export const PLAYER_LASER_SPEED = 8;
export const ALIEN_LASER_SPEED = 5;
export const LASER_COOLDOWN = 300; // ms
// Alien configuration
export const ALIEN_WIDTH = 30;
export const ALIEN_HEIGHT = 20;
export const ALIEN_ROWS = 5;
export const ALIEN_COLS = 11;
export const ALIEN_GRID_START_X = 50;
export const ALIEN_GRID_START_Y = 50;
export const ALIEN_GAP_X = 20;
export const ALIEN_GAP_Y = 20;
export const ALIEN_MOVE_INTERVAL_START = 1000; // ms
export const ALIEN_MOVE_STEP_X = 10;
export const ALIEN_MOVE_STEP_Y = 20;
export const ALIEN_FIRE_INTERVAL = 1000; // ms
// Barrier configuration
export const BARRIER_COUNT = 4;
export const BARRIER_WIDTH = 80;
export const BARRIER_HEIGHT = 40;
export const BARRIER_START_Y = PLAYER_START_Y - BARRIER_HEIGHT - 30;
export const BARRIER_PART_SIZE = 10;
export const BARRIER_PART_HEALTH = 4;
// Colors
export const PLAYER_COLOR = '#0FFF50';
export const ALIEN_COLOR = '#FF00FF';
export const BARRIER_COLOR = '#00FFFF';
export const PLAYER_LASER_COLOR = '#0FFF50';
export const ALIEN_LASER_COLOR = '#FF00FF';
export const BACKGROUND_COLOR = '#0A0A1A';
export const TEXT_COLOR = '#0FFF50';
// Scoring
export const ALIEN_POINTS = {
  A: 30,
  B: 20,
  C: 10,
};