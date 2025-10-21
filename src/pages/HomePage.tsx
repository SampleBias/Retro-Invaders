import { GameCanvas } from '@/components/GameCanvas';
export function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-retro-background text-retro-text p-4 sm:p-8 font-mono relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(hsl(var(--retro-player) / 0.1) 1px, transparent 1px), linear-gradient(to right, hsl(var(--retro-player) / 0.1) 1px, hsl(var(--retro-background)) 1px)',
        backgroundSize: '20px 20px',
      }}/>
      <header className="w-full max-w-5xl text-center mb-4 z-10">
        <h1 className="text-4xl md:text-6xl font-bold tracking-widest text-retro-player" style={{ textShadow: '0 0 10px hsl(var(--retro-player)), 0 0 20px hsl(var(--retro-player))' }}>
          RETRO INVADERS
        </h1>
      </header>
      <main className="flex flex-col items-center justify-center z-10">
        <GameCanvas />
      </main>
      <footer className="w-full max-w-5xl text-center mt-4 text-sm text-retro-player/70 z-10">
        <p>Use Arrow Keys to Move, Spacebar to Shoot, R to Restart.</p>
      </footer>
    </div>
  );
}