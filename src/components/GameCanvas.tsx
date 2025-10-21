import React, { useRef, useEffect } from 'react';
import { useGameLogic } from '@/hooks/useGameLogic';
import { drawGame } from '@/game/drawing';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@/game/config';
export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { gameState, dispatch } = useGameLogic();
  const animationFrameId = useRef<number>();
  useEffect(() => {
    const gameLoop = () => {
      dispatch({ type: 'UPDATE' });
      animationFrameId.current = requestAnimationFrame(gameLoop);
    };
    animationFrameId.current = requestAnimationFrame(gameLoop);
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [dispatch]);
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (context) {
      drawGame(context, gameState);
    }
  }, [gameState]);
  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="bg-retro-background border-2 border-retro-player shadow-retro-glow-player"
    />
  );
}