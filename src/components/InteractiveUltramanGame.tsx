import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Volume2, VolumeX } from 'lucide-react';
import { GameState, type VideoScene } from '../types/game';
import Image from 'next/image';

export function InteractiveUltramanGame() {
  const [gameState, setGameState] = useState<GameState>(GameState.INTRO);
  const [currentScene, setCurrentScene] = useState<VideoScene>({
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-2OyYKLALILjJACoPZN4TQsqLo25V1C.mp4",
    text: "欢迎来到奥特曼的世界！"
  });
  const [showButtons, setShowButtons] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      if (!showButtons) {
        video.play().catch(error => console.log("Video playback failed:", error));
      }
    };

    const handleVideoEnd = () => {
      if (!showButtons) {
        setShowButtons(true);
        video.currentTime = 0;
        video.play().catch(error => console.log("Video playback failed:", error));
      }
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('ended', handleVideoEnd);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('ended', handleVideoEnd);
    };
  }, [showButtons]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.loop = true;
      audio.volume = 0.5;
      audio.play().catch(error => console.log("Audio playback failed:", error));
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted(prevMuted => !prevMuted);
  };

  const playVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(error => console.log("Video playback failed:", error));
    }
  };

  const startGame = () => {
    setGameState(GameState.MONSTER_APPEARS);
    setCurrentScene({
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-TJbQNSk6mjb818bzLfcD8wENi7AQeo.mp4",
      text: "巨大怪兽从地底出现！！！",
      choices: [
        { text: "唤醒奥特曼", action: () => makeFirstChoice('awaken') },
        { text: "逃离现场", action: () => makeFirstChoice('escape') }
      ]
    });
    setShowButtons(false);
    playVideo();
  };

  const makeFirstChoice = (choice: 'awaken' | 'escape') => {
    if (choice === 'awaken') {
      setGameState(GameState.ULTRAMAN_CHOICE);
      setCurrentScene({
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3-Zl5CIZxpueOsQrXbdyTBTDEK2iFeq6.mp4",
        text: "光的英雄被唤醒了！",
        choices: [
          { text: "与怪兽战斗", action: () => makeUltramanChoice('fight') },
          { text: "回M78星云", action: () => makeUltramanChoice('return') }
        ]
      });
    } else {
      setGameState(GameState.GAME_OVER);
      setIsGameOver(true);
      setCurrentScene({
        src: "",
        text: "你灰溜溜的逃回了老家北海道，东京被摧毁了一半，后来你在电视上看到，有人唤醒了奥特曼，世界被拯救了。你在懊悔中度过了一生"
      });
    }
    setShowButtons(false);
    playVideo();
  };

  const makeUltramanChoice = (choice: 'fight' | 'return') => {
    if (choice === 'fight') {
      setGameState(GameState.MONSTER_BATTLE);
      setCurrentScene({
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5-eAFlqn7DKuYGCS344yYqLa2Ta8b2jk.mp4",
        text: "你与怪兽进行了激烈的战斗，突然怪兽开始积蓄能量。你要怎么办？",
        choices: [
          { text: "光波攻击", action: () => makeFinalAttack('attack') },
          { text: "防御姿势", action: () => makeFinalAttack('defend') }
        ]
      });
    } else {
      setGameState(GameState.GAME_OVER);
      setIsGameOver(true);
      setCurrentScene({
        src: "",
        text: "人类与怪兽进行了顽强的搏斗，但最终地球还是被怪兽毁灭了。你成为了M78星云之耻，在懊悔中度过一生"
      });
    }
    setShowButtons(false);
    playVideo();
  };

  const makeFinalAttack = (choice: 'attack' | 'defend') => {
    if (choice === 'attack') {
      setGameState(GameState.VICTORY);
      setCurrentScene({
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/7-P5cjZBOqG87nobZrBnI6KNwoK5eM0C.mp4",
        text: "你成功的打败了怪兽，保护了地球。你成为了人类眼中的英雄",
        choices: [{ text: "任务完成", action: () => setShowLogo(true) }]
      });
    } else {
      setGameState(GameState.GAME_OVER);
      setIsGameOver(true);
      setCurrentScene({
        src: "",
        text: "怪兽自爆了，你成功的防御了自爆冲击，但整个东京都在怪兽的自爆中毁灭了。你遭到了地球政府的强烈谴责"
      });
    }
    setShowButtons(false);
    playVideo();
  };

  const restartGame = () => {
    setGameState(GameState.INTRO);
    setCurrentScene({
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-2OyYKLALILjJACoPZN4TQsqLo25V1C.mp4",
      text: "欢迎来到奥特曼的世界！"
    });
    setShowButtons(false);
    setIsGameOver(false);
    setShowLogo(false);
    playVideo();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0d1117]">
      <div className="relative w-full max-w-4xl aspect-video">
        {!showLogo && !isGameOver && (
          <video
            ref={videoRef}
            src={currentScene.src}
            className="w-full h-full object-cover"
            autoPlay
            loop={showButtons}
            controls={false}
          />
        )}
        <audio 
          ref={audioRef} 
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Battle%20Cry-27MaZuQrmVKlx4g3iHmgsMtSlhMTB0.mp3"
          loop
        />
        <Button
          className="absolute top-4 left-4 bg-black bg-opacity-50 hover:bg-opacity-75 transition-colors"
          onClick={toggleMute}
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </Button>
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end pb-8">
          {!isGameOver && currentScene.text && (
            <div className="mb-4 text-white text-2xl font-bold text-shadow bg-black bg-opacity-50 p-4 rounded-t">
              <p>{currentScene.text}</p>
            </div>
          )}
          {showButtons && currentScene.choices && (
            <div className="flex space-x-4 mb-4">
              {currentScene.choices.map((choice, index) => (
                <Button 
                  key={index}
                  className="bg-[#1a1f2e] hover:bg-[#2c3241] text-white font-bold py-3 px-6 rounded text-xl transition-colors border border-[#30363d]" 
                  onClick={choice.action}
                >
                  {choice.text}
                </Button>
              ))}
            </div>
          )}
          {gameState === GameState.INTRO && (
            <Button 
              className="bg-[#1a1f2e] hover:bg-[#2c3241] text-white font-bold py-3 px-6 rounded text-xl transition-colors border border-[#30363d]" 
              onClick={startGame}
            >
              开始游戏
            </Button>
          )}
        </div>
        {showLogo && (
          <div className="absolute inset-0 bg-[#0d1117] flex flex-col items-center justify-center">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ultraman-uKJPzwDRRdVcAmuOfExlidvc7x53mr.png"
              alt="Ultraman Logo"
              width={300}
              height={100}
              className="mb-8"
            />
            <p className="text-white text-2xl font-bold mb-8">相信光，你就会成为英雄</p>
            <Button 
              className="bg-[#1a1f2e] hover:bg-[#2c3241] text-white font-bold py-3 px-6 rounded text-xl transition-colors border border-[#30363d]"
              onClick={restartGame}
            >
              重新开始
            </Button>
          </div>
        )}
        {isGameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center p-8">
            <h2 className="text-white text-5xl font-bold mb-8">
              游戏结束
            </h2>
            <p className="text-white text-xl text-center max-w-lg mb-8">
              {currentScene.text}
            </p>
            <Button 
              className="bg-[#1a1f2e] hover:bg-[#2c3241] text-white font-bold py-3 px-6 rounded text-xl transition-colors border border-[#30363d]"
              onClick={restartGame}
            >
              重新开始
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}