export interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
}
export interface Player extends GameObject {
  lives: number;
  speed: number;
}
export interface Alien extends GameObject {
  type: 'A' | 'B' | 'C';
  points: number;
}
export interface Laser extends GameObject {
  speed: number;
}
export interface BarrierPart extends GameObject {
  health: number;
}
export type Barrier = BarrierPart[];
export type GameStatus = 'playing' | 'gameOver' | 'waveCleared' | 'paused';
export interface GameState {
  status: GameStatus;
  player: Player;
  aliens: Alien[];
  playerLasers: Laser[];
  alienLasers: Laser[];
  barriers: Barrier[];
  score: number;
  highScore: number;
  wave: number;
  alienDirection: 'left' | 'right';
  alienMoveTimer: number;
  alienFireTimer: number;
  lastPlayerLaserTime: number;
  keys: {
    ArrowLeft: boolean;
    ArrowRight: boolean;
    ' ': boolean;
  };
}
export type GameAction =
  | { type: 'KEY_DOWN'; key: string }
  | { type: 'KEY_UP'; key: string }
  | { type: 'UPDATE' }
  | { type: 'START_NEXT_WAVE' };