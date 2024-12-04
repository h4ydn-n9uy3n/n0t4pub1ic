import { useState, useRef, useEffect } from 'react';

interface AudioFile {
  url: string;
  title: string;
}

interface MusicPlayerProps {
  audioFiles: AudioFile[];
  className?: string;
}

const MusicPlayer = ({ audioFiles, className = '' }: MusicPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioReady, setAudioReady] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number>();
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    const audio = new Audio(audioFiles[0].url);
    audio.preload = 'auto';
    audioRef.current = audio;

    const handleCanPlay = () => setAudioReady(true);
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      // Show title after 12 seconds without affecting playback
      if (audio.currentTime >= 12) {
        setShowTitle(true);
      } else {
        setShowTitle(false);
      }
    };
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      setShowTitle(false);
      audio.currentTime = 0;
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    // Initialize Web Audio API
    const initAudioContext = async () => {
      try {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        const analyser = context.createAnalyser();
        analyser.fftSize = 256;

        const source = context.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(context.destination);

        audioContextRef.current = context;
        analyserRef.current = analyser;
      } catch (error) {
        console.error('Error initializing audio context:', error);
      }
    };

    initAudioContext();

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [audioFiles]);

  const drawVisualizer = () => {
    if (!canvasRef.current || !analyserRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2.5;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const barHeight = (dataArray[i] / 255) * canvas.height;
      
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0.2)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      
      x += barWidth + 1;
    }

    animationFrameRef.current = requestAnimationFrame(drawVisualizer);
  };

  useEffect(() => {
    if (isPlaying) {
      drawVisualizer();
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, [isPlaying]);

  const togglePlay = async () => {
    if (!audioRef.current || !audioContextRef.current || !audioReady) return;

    try {
      await audioContextRef.current.resume();

      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        if (audioRef.current.ended) {
          audioRef.current.currentTime = 0;
          setShowTitle(false);
        }
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
      setIsPlaying(false);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`flex flex-col space-y-4 ${className}`}>
      <div className="h-5">
        {showTitle && (
          <div className="text-center text-sm text-white/80 font-medium animate-fade-in">
            {audioFiles[0].title}
          </div>
        )}
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={togglePlay}
          className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
            audioReady ? 'bg-white/10 hover:bg-white/20' : 'bg-white/5 cursor-wait'
          }`}
          disabled={!audioReady}
        >
          {isPlaying ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
        
        <div className="flex-1 flex items-center space-x-2">
          <div className="flex-1 h-12 relative">
            <canvas
              ref={canvasRef}
              className="w-full h-full rounded-lg"
              width={300}
              height={48}
            />
          </div>
          <span className="text-xs opacity-60 min-w-[40px]">
            {formatTime(currentTime)}
          </span>
        </div>
      </div>
      <div 
        className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm shadow-lg p-4 flex items-center justify-between cursor-default"
        style={{ zIndex: 1000 }}
      />
    </div>
  );
};

export default MusicPlayer;
