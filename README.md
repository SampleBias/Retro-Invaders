# Retro Invaders

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/SampleBias/Retro-Invaders)

A visually stunning, retro-themed Space Invaders clone built with React, TypeScript, and the HTML Canvas API for classic arcade action.

Retro Invaders is a faithful, modern recreation of the classic arcade game, designed with a stunning retro-futuristic aesthetic. Built entirely with React, TypeScript, and the HTML Canvas API, it delivers a high-performance, visually captivating experience. The game features a player-controlled ship, a descending grid of alien invaders, destructible defensive barriers, and a progressive wave system. The entire presentation is wrapped in a nostalgic, early-internet, pixel-art style, complete with neon glows and a chunky, pixelated font.

## Key Features

-   **Classic Gameplay:** Authentic Space Invaders mechanics for a nostalgic experience.
-   **Modern Tech Stack:** Built with React, TypeScript, and Vite for a high-performance, modern development workflow.
-   **Canvas Rendering:** Smooth, pixel-perfect graphics rendered on the HTML Canvas.
-   **Progressive Difficulty:** Alien invaders speed up and become more aggressive with each new wave.
-   **Destructible Barriers:** Use defensive barriers for cover, but watch as they get destroyed by enemy and player fire.
-   **State Management:** Robust game state handling for score, lives, and wave progression.
-   **High Score Tracking:** Your highest score is saved locally in your browser.
-   **Responsive Design:** The game interface is fully responsive and playable on all screen sizes.

## Technology Stack

-   **Frontend:** React, TypeScript, Vite
-   **Styling:** Tailwind CSS, shadcn/ui
-   **Animation:** Framer Motion
-   **State Management:** React Hooks (`useReducer`)
-   **Deployment:** Cloudflare Pages & Workers

## Getting Started

Follow these instructions to get a local copy of the project up and running for development and testing purposes.

### Prerequisites

-   [Bun](https://bun.sh/) installed on your machine.
-   [Git](https://git-scm.com/) for version control.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/retro_invaders.git
    cd retro_invaders
    ```

2.  **Install dependencies:**
    ```sh
    bun install
    ```

3.  **Run the development server:**
    ```sh
    bun dev
    ```
    The application will be available at `http://localhost:3000`.

## Project Structure

The project is organized to separate game logic from the React component layer.

-   `src/pages/HomePage.tsx`: The main entry point of the application, which sets up the game layout.
-   `src/components/GameCanvas.tsx`: The core React component that manages the canvas and the main game loop.
-   `src/hooks/useGameLogic.ts`: A custom hook that contains all the game state and logic, managed with `useReducer`.
-   `src/game/`: A directory containing all the core, framework-agnostic game logic.
    -   `types.ts`: TypeScript type definitions for all game entities.
    -   `config.ts`: Centralized configuration for game balance (speeds, sizes, etc.).
    -   `drawing.ts`: Pure functions responsible for rendering the game state onto the canvas.
    -   `utils.ts`: Helper functions for tasks like collision detection.

## Available Scripts

-   `bun dev`: Starts the development server.
-   `bun build`: Builds the application for production.
-   `bun lint`: Lints the codebase.
-   `bun deploy`: Deploys the application to Cloudflare.

## Deployment

This project is optimized for deployment on the Cloudflare network.

### One-Click Deploy

You can deploy this application to your own Cloudflare account with a single click.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/SampleBias/Retro-Invaders)

### Manual Deployment

1.  **Build the project:**
    ```sh
    bun run build
    ```

2.  **Deploy using Wrangler:**
    Make sure you have [Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed and configured.
    ```sh
    bun run deploy
    ```
    This command will deploy your application to Cloudflare Pages.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.