import React, { useState, useEffect, useCallback, useRef } from 'react';

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION: Direction = 'RIGHT';
const GAME_SPEED = 100;

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
}

export default function SnakeGame({ onScoreChange }: SnakeGameProps) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 15, y: 10 });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);

  const directionRef = useRef<Direction>(INITIAL_DIRECTION);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    onScoreChange(0);
    setGameOver(false);
    setFood(generateFood(INITIAL_SNAKE));
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (gameOver) return;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (directionRef.current !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (directionRef.current !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (directionRef.current !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (directionRef.current !== 'LEFT') setDirection('RIGHT');
          break;
        case ' ':
          setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = { ...head };

        directionRef.current = direction;

        switch (direction) {
          case 'UP': newHead.y -= 1; break;
          case 'DOWN': newHead.y += 1; break;
          case 'LEFT': newHead.x -= 1; break;
          case 'RIGHT': newHead.x += 1; break;
        }

        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          const newScore = score + 10;
          setScore(newScore);
          onScoreChange(newScore);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(intervalId);
  }, [direction, food, gameOver, isPaused, score, onScoreChange, generateFood]);

  return (
    <div className="relative w-full max-w-md aspect-square bg-black overflow-hidden">
      {/* Grid background */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'linear-gradient(#00FFFF 1px, transparent 1px), linear-gradient(90deg, #00FFFF 1px, transparent 1px)',
          backgroundSize: `${100 / GRID_SIZE}% ${100 / GRID_SIZE}%`
        }}
      />
      
      {/* Game Canvas */}
      <div className="absolute inset-0">
        {snake.map((segment, index) => (
          <div
            key={`${segment.x}-${segment.y}-${index}`}
            className="absolute bg-[#00FFFF] border border-black"
            style={{
              left: `${(segment.x / GRID_SIZE) * 100}%`,
              top: `${(segment.y / GRID_SIZE) * 100}%`,
              width: `${100 / GRID_SIZE}%`,
              height: `${100 / GRID_SIZE}%`,
              opacity: index === 0 ? 1 : 0.8,
            }}
          />
        ))}
        <div
          className="absolute bg-[#FF00FF] border border-white animate-pulse"
          style={{
            left: `${(food.x / GRID_SIZE) * 100}%`,
            top: `${(food.y / GRID_SIZE) * 100}%`,
            width: `${100 / GRID_SIZE}%`,
            height: `${100 / GRID_SIZE}%`,
          }}
        />
      </div>

      {/* Overlays */}
      {gameOver && (
        <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-10 border-4 border-[#FF00FF] m-4">
          <div className="glitch-wrapper mb-4">
            <h2 className="text-4xl font-bold text-white glitch text-center" data-text="FATAL_ERROR">FATAL_ERROR</h2>
          </div>
          <p className="text-[#00FFFF] mb-6 text-xl tracking-widest">SECTOR_CORRUPT</p>
          <button 
            onClick={resetGame}
            className="px-6 py-3 bg-[#FF00FF] text-black font-bold text-xl hover:bg-[#00FFFF] hover:text-black transition-none uppercase tracking-widest border-2 border-white cursor-pointer"
          >
            REBOOT_SYS
          </button>
        </div>
      )}

      {isPaused && !gameOver && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10 border-4 border-[#00FFFF] m-4">
          <div className="glitch-wrapper">
            <h2 className="text-4xl font-bold text-white glitch tracking-widest" data-text="SYS_SUSPENDED">SYS_SUSPENDED</h2>
          </div>
        </div>
      )}
    </div>
  );
}
