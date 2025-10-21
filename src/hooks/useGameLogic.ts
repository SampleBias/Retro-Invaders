import { useReducer, useEffect, useCallback } from 'react';
import { GameState, GameAction, Alien, Barrier, BarrierPart } from '@/game/types';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  PLAYER_START_Y,
  PLAYER_SPEED,
  PLAYER_LIVES,
  LASER_WIDTH,
  LASER_HEIGHT,
  PLAYER_LASER_SPEED,
  ALIEN_LASER_SPEED,
  LASER_COOLDOWN,
  ALIEN_ROWS,
  ALIEN_COLS,
  ALIEN_GRID_START_X,
  ALIEN_GRID_START_Y,
  ALIEN_GAP_X,
  ALIEN_GAP_Y,
  ALIEN_WIDTH,
  ALIEN_HEIGHT,
  ALIEN_MOVE_INTERVAL_START,
  ALIEN_MOVE_STEP_X,
  ALIEN_MOVE_STEP_Y,
  ALIEN_FIRE_INTERVAL,
  BARRIER_COUNT,
  BARRIER_WIDTH,
  BARRIER_START_Y,
  BARRIER_PART_SIZE,
  BARRIER_PART_HEALTH,
  ALIEN_POINTS,
} from '@/game/config';
import { isColliding, getRandomInt } from '@/game/utils';
const HIGH_SCORE_KEY = 'retro_invaders_high_score';
const createAliens = (): Alien[] => {
  const aliens: Alien[] = [];
  for (let row = 0; row < ALIEN_ROWS; row++) {
    for (let col = 0; col < ALIEN_COLS; col++) {
      const type = row < 1 ? 'A' : row < 3 ? 'B' : 'C';
      aliens.push({
        x: ALIEN_GRID_START_X + col * (ALIEN_WIDTH + ALIEN_GAP_X),
        y: ALIEN_GRID_START_Y + row * (ALIEN_HEIGHT + ALIEN_GAP_Y),
        width: ALIEN_WIDTH,
        height: ALIEN_HEIGHT,
        type,
        points: ALIEN_POINTS[type],
      });
    }
  }
  return aliens;
};
const createBarriers = (): Barrier[] => {
  const barriers: Barrier[] = [];
  const totalBarrierWidth = BARRIER_COUNT * BARRIER_WIDTH;
  const totalGapWidth = CANVAS_WIDTH - totalBarrierWidth;
  const gap = totalGapWidth / (BARRIER_COUNT + 1);
  for (let i = 0; i < BARRIER_COUNT; i++) {
    const barrierX = gap * (i + 1) + BARRIER_WIDTH * i;
    const barrier: BarrierPart[] = [];
    const cols = Math.floor(BARRIER_WIDTH / BARRIER_PART_SIZE);
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < cols; c++) {
        // Create a classic bunker shape
        if ((r === 0 && (c < 2 || c > cols - 3)) || (r === 1 && (c === 0 || c === cols - 1))) continue;
        barrier.push({
          x: barrierX + c * BARRIER_PART_SIZE,
          y: BARRIER_START_Y + r * BARRIER_PART_SIZE,
          width: BARRIER_PART_SIZE,
          height: BARRIER_PART_SIZE,
          health: BARRIER_PART_HEALTH,
        });
      }
    }
    barriers.push(barrier);
  }
  return barriers;
};
function createInitialState(): GameState {
  const highScore = parseInt(localStorage.getItem(HIGH_SCORE_KEY) || '0', 10);
  return {
    status: 'playing',
    player: {
      x: (CANVAS_WIDTH - PLAYER_WIDTH) / 2,
      y: PLAYER_START_Y,
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT,
      lives: PLAYER_LIVES,
      speed: PLAYER_SPEED,
    },
    aliens: createAliens(),
    playerLasers: [],
    alienLasers: [],
    barriers: createBarriers(),
    score: 0,
    highScore,
    wave: 1,
    alienDirection: 'right',
    alienMoveTimer: Date.now(),
    alienFireTimer: Date.now(),
    lastPlayerLaserTime: 0,
    keys: { ArrowLeft: false, ArrowRight: false, ' ': false },
  };
}
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'KEY_DOWN':
      if (action.key.toLowerCase() === 'r' && state.status === 'gameOver') {
        return createInitialState();
      }
      if (action.key === 'Enter' && state.status === 'waveCleared') {
        return { ...state, type: 'NEXT_WAVE' }; // Trigger next wave
      }
      return { ...state, keys: { ...state.keys, [action.key]: true } };
    case 'NEXT_WAVE':
      return {
        ...state,
        status: 'playing',
        wave: state.wave + 1,
        aliens: createAliens(),
        barriers: createBarriers(),
        playerLasers: [],
        alienLasers: [],
        alienDirection: 'right',
        alienMoveTimer: Date.now(),
        alienFireTimer: Date.now(),
      };
    case 'KEY_UP':
      return { ...state, keys: { ...state.keys, [action.key]: false } };
    case 'UPDATE': {
      if (state.status !== 'playing') return state;
      let newState = { ...state };
      const now = Date.now();
      // Player movement
      let newPlayerX = newState.player.x;
      if (newState.keys.ArrowLeft && newState.player.x > 0) {
        newPlayerX -= newState.player.speed;
      }
      if (newState.keys.ArrowRight && newState.player.x < CANVAS_WIDTH - newState.player.width) {
        newPlayerX += newState.player.speed;
      }
      if (newPlayerX !== newState.player.x) {
        newState.player = { ...newState.player, x: newPlayerX };
      }
      // Player shooting
      if (newState.keys[' '] && now - newState.lastPlayerLaserTime > LASER_COOLDOWN) {
        newState.playerLasers = [...newState.playerLasers, {
          x: newState.player.x + newState.player.width / 2 - LASER_WIDTH / 2,
          y: newState.player.y,
          width: LASER_WIDTH,
          height: LASER_HEIGHT,
          speed: PLAYER_LASER_SPEED,
        }];
        newState.lastPlayerLaserTime = now;
      }
      // Move lasers
      newState.playerLasers = newState.playerLasers
        .map(l => ({ ...l, y: l.y - l.speed }))
        .filter(l => l.y + l.height > 0);
      newState.alienLasers = newState.alienLasers
        .map(l => ({ ...l, y: l.y + l.speed }))
        .filter(l => l.y < CANVAS_HEIGHT);
      // Alien movement
      const alienCount = newState.aliens.length;
      const alienMoveInterval = ALIEN_MOVE_INTERVAL_START / newState.wave - alienCount * 4;
      if (now - newState.alienMoveTimer > Math.max(50, alienMoveInterval)) {
        let wallHit = false;
        let moveDown = false;
        const newAliens = newState.aliens.map(alien => {
          let newX = alien.x;
          if (newState.alienDirection === 'right') {
            newX += ALIEN_MOVE_STEP_X;
            if (newX + alien.width > CANVAS_WIDTH) wallHit = true;
          } else {
            newX -= ALIEN_MOVE_STEP_X;
            if (newX < 0) wallHit = true;
          }
          return { ...alien, x: newX };
        });
        newState.aliens = newAliens;
        if (wallHit) {
          newState.alienDirection = newState.alienDirection === 'right' ? 'left' : 'right';
          moveDown = true;
        }
        if (moveDown) {
          newState.aliens = newState.aliens.map(alien => ({ ...alien, y: alien.y + ALIEN_MOVE_STEP_Y }));
        }
        newState.alienMoveTimer = now;
      }
      // Alien shooting
      if (now - newState.alienFireTimer > ALIEN_FIRE_INTERVAL && newState.aliens.length > 0) {
        const shootingAlien = newState.aliens[getRandomInt(0, newState.aliens.length - 1)];
        newState.alienLasers = [...newState.alienLasers, {
          x: shootingAlien.x + shootingAlien.width / 2 - LASER_WIDTH / 2,
          y: shootingAlien.y + shootingAlien.height,
          width: LASER_WIDTH,
          height: LASER_HEIGHT,
          speed: ALIEN_LASER_SPEED,
        }];
        newState.alienFireTimer = now;
      }
      // --- Collision detection ---
      let scoreToAdd = 0;
      const remainingAliens: Alien[] = [];
      // Player lasers vs aliens
      newState.aliens.forEach(alien => {
        let hit = false;
        newState.playerLasers = newState.playerLasers.filter(laser => {
          if (isColliding(laser, alien)) {
            hit = true;
            scoreToAdd += alien.points;
            return false; // remove laser
          }
          return true;
        });
        if (!hit) remainingAliens.push(alien);
      });
      newState.aliens = remainingAliens;
      newState.score += scoreToAdd;
      // Alien lasers vs player
      let playerLives = newState.player.lives;
      const remainingAlienLasersForPlayer = newState.alienLasers.filter(laser => {
        if (isColliding(laser, newState.player)) {
          playerLives--;
          return false; // remove laser
        }
        return true;
      });

      if (playerLives < newState.player.lives) {
        newState.player = { ...newState.player, lives: playerLives };
      }
      newState.alienLasers = remainingAlienLasersForPlayer;
      // Lasers vs barriers
      const allLasers = [...newState.playerLasers, ...newState.alienLasers];
      let newBarriers = newState.barriers;

      if (allLasers.length > 0 && newBarriers.length > 0) {
        newBarriers = newBarriers.map(barrier =>
          barrier.map(part => {
            for (const laser of allLasers) {
              if (part.health > 0 && isColliding(laser, part)) {
                return { ...part, health: part.health - 1 };
              }
            }
            return part;
          })
        );
      }

      const filterAbsorbedLasers = (laser: { x: number, y: number, width: number, height: number }) => {
        for (const barrier of newBarriers) {
          for (const part of barrier) {
            if (part.health > 0 && isColliding(laser, part)) {
              return false; // Laser was absorbed
            }
          }
        }
        return true;
      };

      newState.playerLasers = newState.playerLasers.filter(filterAbsorbedLasers);
      newState.alienLasers = newState.alienLasers.filter(filterAbsorbedLasers);
      newState.barriers = newBarriers.map(b => b.filter(p => p.health > 0));
      // Check game over conditions
      const alienReachedBottom = newState.aliens.some(a => a.y + a.height >= newState.player.y);
      if (newState.player.lives <= 0 || alienReachedBottom) {
        newState.status = 'gameOver';
        if (newState.score > newState.highScore) {
          newState.highScore = newState.score;
          localStorage.setItem(HIGH_SCORE_KEY, newState.score.toString());
        }
        return newState; // Return immediately on game over
      }
      // Check for wave clear
      if (newState.aliens.length === 0 && newState.status === 'playing') {
        newState.status = 'waveCleared';
        return newState;
      }
      return newState;
    }
    default:
      return state;
  }
}
export function useGameLogic() {
  const [gameState, dispatch] = useReducer(gameReducer, undefined, createInitialState);
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (['ArrowLeft', 'ArrowRight', ' '].includes(e.key) || (e.key.toLowerCase() === 'r' && gameState.status === 'gameOver') || (e.key === 'Enter' && gameState.status === 'waveCleared')) {
      e.preventDefault();
      dispatch({ type: 'KEY_DOWN', key: e.key });
    }
  }, [gameState.status]);
  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (['ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
      dispatch({ type: 'KEY_UP', key: e.key });
    }
  }, []);
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);
  return { gameState, dispatch };
}