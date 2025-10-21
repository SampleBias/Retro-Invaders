import { GameState } from './types';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  PLAYER_COLOR,
  ALIEN_COLOR,
  BARRIER_COLOR,
  PLAYER_LASER_COLOR,
  ALIEN_LASER_COLOR,
  BACKGROUND_COLOR,
  TEXT_COLOR,
} from './config';
function drawRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string
) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}
function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size: number = 20,
  align: CanvasTextAlign = 'left'
) {
  ctx.fillStyle = TEXT_COLOR;
  ctx.font = `${size}px 'JetBrains Mono', monospace`;
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
}
export function drawGame(ctx: CanvasRenderingContext2D, state: GameState) {
  // Clear canvas
  drawRect(ctx, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, BACKGROUND_COLOR);
  // Draw player
  const { player } = state;
  drawRect(ctx, player.x, player.y, player.width, player.height, PLAYER_COLOR);
  // Draw aliens
  state.aliens.forEach(alien => {
    drawRect(ctx, alien.x, alien.y, alien.width, alien.height, ALIEN_COLOR);
  });
  // Draw barriers
  state.barriers.forEach(barrier => {
    barrier.forEach(part => {
      const opacity = part.health / 4;
      ctx.globalAlpha = opacity;
      drawRect(ctx, part.x, part.y, part.width, part.height, BARRIER_COLOR);
      ctx.globalAlpha = 1.0;
    });
  });
  // Draw lasers
  state.playerLasers.forEach(laser => {
    drawRect(ctx, laser.x, laser.y, laser.width, laser.height, PLAYER_LASER_COLOR);
  });
  state.alienLasers.forEach(laser => {
    drawRect(ctx, laser.x, laser.y, laser.width, laser.height, ALIEN_LASER_COLOR);
  });
  // Draw UI
  drawText(ctx, `SCORE: ${state.score}`, 20, 30);
  drawText(ctx, `HIGH SCORE: ${state.highScore}`, CANVAS_WIDTH / 2, 30, 20, 'center');
  drawText(ctx, `LIVES: ${state.player.lives}`, CANVAS_WIDTH - 120, 30);
  // Draw Game Over or Wave Cleared message
  if (state.status === 'gameOver') {
    drawText(ctx, 'GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20, 48, 'center');
    drawText(ctx, 'Press R to Restart', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20, 20, 'center');
  } else if (state.status === 'waveCleared') {
    drawText(ctx, `WAVE ${state.wave} CLEARED`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20, 48, 'center');
    drawText(ctx, 'Press Enter to Continue', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20, 20, 'center');
  }
}