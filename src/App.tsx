import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Terminal } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-black text-white font-mono flex flex-col items-center py-8 px-4 relative crt-flicker">
      {/* Glitch & CRT Overlays */}
      <div className="static-noise" />
      <div className="scanlines" />
      
      {/* Header */}
      <header className="w-full max-w-5xl flex items-center justify-between mb-8 z-10 border-b-4 border-[#FF00FF] pb-4 screen-tear">
        <div className="flex items-center space-x-4">
          <Terminal className="w-10 h-10 text-[#00FFFF]" />
          <div className="glitch-wrapper">
            <h1 className="text-4xl font-black tracking-widest text-white glitch uppercase" data-text="SYS.OP // SNAKE_PROTOCOL">
              SYS.OP // SNAKE_PROTOCOL
            </h1>
          </div>
        </div>
        
        <div className="flex flex-col items-end border-2 border-[#00FFFF] p-2 bg-black">
          <span className="text-sm font-bold text-[#FF00FF] tracking-widest uppercase">DATA_HARVESTED</span>
          <span className="text-4xl font-bold text-[#00FFFF]">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-5xl flex flex-col lg:flex-row items-start justify-center gap-8 z-10 flex-1">
        {/* Game Section */}
        <div className="flex-1 w-full flex justify-center border-4 border-[#00FFFF] p-1 bg-[#001111] relative">
          <div className="absolute top-0 left-0 bg-[#00FFFF] text-black text-xs px-2 py-1 font-bold z-20">
            EXEC: snake.exe
          </div>
          <SnakeGame onScoreChange={setScore} />
        </div>

        {/* Sidebar / Player Section */}
        <div className="w-full lg:w-96 flex flex-col gap-8">
          <div className="bg-black border-4 border-[#FF00FF] p-6 relative">
            <div className="absolute top-0 right-0 bg-[#FF00FF] text-black text-xs px-2 py-1 font-bold">
              MANUAL_OVERRIDE
            </div>
            <h3 className="text-[#00FFFF] text-xl font-bold mb-4 uppercase tracking-widest">
              &gt; INPUT_PARAMS
            </h3>
            <ul className="space-y-4 text-lg text-white">
              <li className="flex justify-between border-b border-[#FF00FF]/30 pb-2">
                <span>VECTOR_CTRL</span>
                <span className="text-[#00FFFF] bg-[#00FFFF]/20 px-2">W,A,S,D</span>
              </li>
              <li className="flex justify-between border-b border-[#FF00FF]/30 pb-2">
                <span>HALT_PROCESS</span>
                <span className="text-[#00FFFF] bg-[#00FFFF]/20 px-2">SPACE</span>
              </li>
            </ul>
          </div>

          <MusicPlayer />
        </div>
      </main>
    </div>
  );
}
