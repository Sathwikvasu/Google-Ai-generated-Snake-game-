import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "ERR_0x00A1",
    artist: "SYNTH_CORE_V1",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: 2,
    title: "MEM_LEAK_DETECTED",
    artist: "NEURAL_NET_99",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: 3,
    title: "BUFFER_OVERFLOW",
    artist: "ALGO_RHYTHM",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnd = () => {
    nextTrack();
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="w-full max-w-md bg-black border-4 border-[#00FFFF] p-6 relative screen-tear">
      <div className="absolute top-0 left-0 bg-[#00FFFF] text-black text-xs px-2 py-1 font-bold">
        AUDIO_SUBSYSTEM
      </div>
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />
      
      <div className="flex items-center justify-between mb-6 mt-4">
        <div className="flex flex-col">
          <h3 className="text-2xl font-bold text-[#FF00FF] uppercase truncate max-w-[200px]">
            {currentTrack.title}
          </h3>
          <p className="text-white text-sm bg-[#FF00FF]/20 inline-block px-1 mt-1">
            SRC: {currentTrack.artist}
          </p>
        </div>
        
        <div className="flex items-center space-x-1 border-2 border-[#00FFFF] p-1 bg-[#002222]">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i} 
              className={`w-2 bg-[#00FFFF] ${isPlaying ? 'animate-music-bar' : 'h-2'}`}
              style={{ 
                height: isPlaying ? '20px' : '4px',
                animationDelay: `${i * 0.1}s` 
              }}
            />
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-4 bg-gray-900 border-2 border-[#FF00FF] mb-6 relative">
        <div 
          className="h-full bg-[#FF00FF] transition-all duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9InRyYW5zcGFyZW50Ii8+PHBhdGggZD0iTTAgMEw0IDRaIiBzdHJva2U9InJnYmEoMCwwLDAsMC4zKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] opacity-50 pointer-events-none" />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between bg-[#001111] border-2 border-[#00FFFF] p-2">
        <button 
          onClick={toggleMute}
          className="p-2 text-[#00FFFF] hover:bg-[#00FFFF] hover:text-black transition-none cursor-pointer"
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>

        <div className="flex items-center space-x-4">
          <button 
            onClick={prevTrack}
            className="p-2 text-[#FF00FF] hover:bg-[#FF00FF] hover:text-black transition-none cursor-pointer"
          >
            <SkipBack size={24} />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-12 h-12 flex items-center justify-center bg-[#00FFFF] text-black hover:bg-white transition-none cursor-pointer border-2 border-black"
          >
            {isPlaying ? <Pause size={28} className="fill-current" /> : <Play size={28} className="fill-current ml-1" />}
          </button>
          
          <button 
            onClick={nextTrack}
            className="p-2 text-[#FF00FF] hover:bg-[#FF00FF] hover:text-black transition-none cursor-pointer"
          >
            <SkipForward size={24} />
          </button>
        </div>

        <div className="w-10 text-xs text-[#00FFFF] font-bold text-center">
          {isPlaying ? 'ON' : 'OFF'}
        </div>
      </div>
    </div>
  );
}
