import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

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
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showTitle, setShowTitle] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number>();
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    const setupAudio = () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }

      // Ensure the audio URL is absolute for Vercel deployment
      const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL 
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
        : '';
      const audioUrl = `${baseUrl}${audioFiles[currentTrack].url}`;
      
      audioRef.current = new Audio(audioUrl);
      audioRef.current.load();
      
      audioRef.current.addEventListener('canplaythrough', () => {
        setIsReady(true);
      });

      audioRef.current.addEventListener('error', (e) => {
        console.error('Audio loading error:', e);
        toast.error('Error loading audio track');
        setIsReady(false);
      });

      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current.currentTime);
        // Show title after 12 seconds without affecting playback
        if (audioRef.current.currentTime >= 12) {
          setShowTitle(true);
        } else {
          setShowTitle(false);
        }
      });

      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current.duration);
      });

      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentTime(0);
        setShowTitle(false);
        audioRef.current.currentTime = 0;
      });
    };

    setupAudio();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [currentTrack, audioFiles]);

  const initAudioContext = async () => {
    if (!audioContextRef.current) {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContext();
        await audioContextRef.current.resume();
      } catch (error) {
        console.error('Error initializing AudioContext:', error);
        toast.error('Error initializing audio. Please try again.');
      }
    }
  };

  const togglePlay = async () => {
    if (!audioRef.current || !isReady) return;

    try {
      if (!isPlaying) {
        await initAudioContext();
        await audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      toast.error('Error playing audio. Please try again.');
      setIsPlaying(false);
    }
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % audioFiles.length);
    setIsPlaying(false);
    setIsReady(false);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + audioFiles.length) % audioFiles.length);
    setIsPlaying(false);
    setIsReady(false);
  };

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
            {audioFiles[currentTrack].title}
          </div>
        )}
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={prevTrack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          disabled={!isReady}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={togglePlay}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          disabled={!isReady}
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </button>

        <button
          onClick={nextTrack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          disabled={!isReady}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
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
      
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm shadow-lg p-4 flex items-center justify-between cursor-default">
        <span className="text-sm text-gray-500">
          {isReady ? `Track ${currentTrack + 1} of ${audioFiles.length}` : 'Loading...'}
        </span>
      </div>
    </div>
  );
};

export default MusicPlayer;
