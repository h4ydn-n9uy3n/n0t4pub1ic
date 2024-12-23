import { useState, useRef, useEffect } from 'react';
import { ThemeNames } from '../utils/themes';

interface AudioFile {
  url: string;
  title: string;
  duration: number; // Add duration property to AudioFile interface
}

interface MusicPlayerProps {
  audioFiles: AudioFile[];
  className?: string;
  currentTheme: ThemeNames;
}

const getPlayerColors = (theme: ThemeNames) => {
  switch (theme) {
    case 'happy':
      return { button: '#e0479e', progress: '#ffcfd2', progressFill: '#e0479e' };
    case 'blessed':
      return { button: '#4ECDC4', progress: '#e8fff8', progressFill: '#4ECDC4' };
    case 'calm':
      return { button: '#98C1D9', progress: '#e3f6f5', progressFill: '#98C1D9' };
    case 'romantic':
      return { button: '#FFB5E8', progress: '#f3e8ff', progressFill: '#FFB5E8' };
    case 'dreamy':
      return { button: '#B8B8FF', progress: '#e0f4ff', progressFill: '#B8B8FF' };
    case 'cozy':
      return { button: '#D4A373', progress: '#fff8ea', progressFill: '#D4A373' };
    case 'peaceful':
      return { button: '#A8E6CF', progress: '#f0f9f9', progressFill: '#A8E6CF' };
    case 'loved':
      return { button: '#FF6B6B', progress: '#ffe6e6', progressFill: '#FF6B6B' };
    case 'energetic':
      return { button: '#F7B267', progress: '#fff3b0', progressFill: '#F7B267' };
    default:
      return { button: '#e0479e', progress: '#ffcfd2', progressFill: '#e0479e' };
  }
};

const MusicPlayer = ({ audioFiles, className = '', currentTheme }: MusicPlayerProps) => {
  const [duration, setDuration] = useState(0);
  const [audioReady, setAudioReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTitle, setShowTitle] = useState(false);
  
  const changeTheme = (newTheme: ThemeNames) => {
    // Add logic to change theme here
  };
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPausing, setIsPausing] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number>();
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    
    // Use relative URL and ensure proper encoding
    const audioUrl = process.env.NODE_ENV === 'production' 
      ? `/audio/${encodeURIComponent(audioFiles[0].url.split('/').pop() || '')}?v=${Date.now()}`
      : audioFiles[0].url;
    console.log('Constructed audio URL:', audioUrl);
    
    audio.src = audioUrl;
    audio.preload = 'auto';  // Changed to auto for better loading
    audioRef.current = audio;

    console.log('Environment:', process.env.NODE_ENV);
    console.log('Loading audio from:', audioUrl);

    const handleCanPlay = () => {
      console.log('Audio can play');
      setAudioReady(true);
      setError(null);
    };

    const handleLoadStart = () => {
      console.log('Audio loading started');
      setError(null);
    };

    const handleLoadedData = () => {
      console.log('Audio data loaded');
      setError(null);
    };

    const handleLoadedMetadata = () => {
      console.log('Audio metadata loaded');
      setError(null);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      audio.currentTime = 0;
    };

    const handleError = (e: any) => {
      const error = e.target?.error;
      console.error('Audio error:', {
        code: error?.code,
        message: error?.message,
        networkState: audio.networkState,
        readyState: audio.readyState,
        currentSrc: audio.currentSrc,
        error: error
      });

      let errorMessage = 'Error loading audio';
      
      switch(error?.code) {
        case 1:
          errorMessage = 'Audio loading aborted';
          break;
        case 2:
          errorMessage = 'Network error occurred';
          break;
        case 3:
          errorMessage = 'Audio decoding failed';
          break;
        case 4:
          errorMessage = 'Audio source not supported';
          break;
      }

      setError(`${errorMessage}. Please try refreshing the page.`);
      setAudioReady(false);
      setIsPlaying(false);

      // Try to recover by reloading with a new cache-busting parameter
      if (process.env.NODE_ENV === 'production') {
        setTimeout(() => {
          const newUrl = `/audio/${encodeURIComponent(audioFiles[0].url.split('/').pop() || '')}?v=${Date.now()}`;
          console.log('Retrying with URL:', newUrl);
          audio.src = newUrl;
          audio.load();
        }, 1000);
      }
    };

    const handleTimeUpdate = () => {
      if (!audioRef.current) return;
      
      const currentTime = audioRef.current.currentTime;
      console.log('Current Time:', currentTime, 'Show Title:', currentTime >= 11);
      
      setCurrentTime(currentTime);
      setShowTitle(currentTime >= 11);
    };

    // Add event listeners
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('timeupdate', handleTimeUpdate);

    useEffect(() => {
      if (audioRef.current) {
        audioRef.current.addEventListener('loadedmetadata', () => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
          }
        });
      }
    }, [audioFiles]);

    // Initial load
    audio.load();

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      audio.pause();
      audio.src = '';
      audio.load();
    };
  }, [audioFiles]);

  useEffect(() => {
    if (audioReady) {
      return () => {};
    }
  }, [audioReady]);

  const initAudioContext = async () => {
    if (!audioRef.current) return;

    try {
      if (!audioContextRef.current) {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        const analyser = context.createAnalyser();
        analyser.fftSize = 256;

        const source = context.createMediaElementSource(audioRef.current);
        source.connect(analyser);
        analyser.connect(context.destination);

        audioContextRef.current = context;
        analyserRef.current = analyser;
        sourceRef.current = source;
      }

      // Resume the audio context
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      setError(null);
    } catch (error) {
      console.error('Error initializing audio context:', error);
      setError('Error initializing audio');
      setIsPlaying(false);
    }
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

    // Get theme colors for visualizer
    const colors = getPlayerColors(currentTheme);
    
    for (let i = 0; i < bufferLength; i++) {
      const barHeight = (dataArray[i] / 255) * canvas.height;
      
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, `${colors.button}cc`); // 80% opacity
      gradient.addColorStop(1, `${colors.button}33`); // 20% opacity
      
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
    if (!audioRef.current || !audioReady) return;

    try {
      // Initialize audio context on first play
      if (!audioContextRef.current) {
        await initAudioContext();
      }

      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        setIsPausing(true);
      } else {
        if (audioRef.current.ended) {
          audioRef.current.currentTime = 0;
        }

        // Resume audio context if suspended
        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }

        await audioRef.current.play();
        setIsPlaying(true);
        setIsPausing(false);
        setError(null);
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
      setError('Error playing audio');
      setIsPlaying(false);
      setIsPausing(true);
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        setIsPausing(true);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
        setIsPausing(false);
      }
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const bounds = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - bounds.left) / bounds.width;
    const newTime = percent * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`relative w-full max-w-md mx-auto ${className}`}>
      <div className="relative w-full bg-opacity-20 rounded-lg overflow-hidden">
        <div className="h-5">
          {error && (
            <div className="text-center text-sm text-red-400 font-medium animate-fade-in">
              {error}
            </div>
          )}
          {showTitle && (
            <div 
              className="text-center text-lg font-bold"
              style={{ 
                color: getPlayerColors(currentTheme).button
              }}
            >
              SET NHAC DANH CHO MY NHAN
              {isPausing && <span className="ml-2">(Paused)</span>}
            </div>
          )}
        </div>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-4">
            <button
              onClick={togglePlayPause}
              className="w-10 h-10 flex items-center justify-center rounded-full text-white shadow-lg transition-all duration-300"
              style={{ backgroundColor: getPlayerColors(currentTheme).button }}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </button>
            
            <div className="flex-1 flex flex-col space-y-1">
              <div 
                className="h-1 rounded-full overflow-hidden cursor-pointer transition-all duration-300"
                onClick={handleSeek} // Ensure this matches your click handler
                style={{ backgroundColor: getPlayerColors(currentTheme).progress }} // Use theme-based color
              >
                <div 
                  className="h-full transition-all duration-300"
                  style={{ 
                    width: `${(currentTime / duration) * 100}%`,
                    backgroundColor: getPlayerColors(currentTheme).progressFill // Use theme-based fill color
                  }}
                />
              </div>
              
              <div className="flex justify-between text-xs text-white/60">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>

          <div className="h-12 relative">
            <canvas
              ref={canvasRef}
              className="w-full h-full rounded-lg"
              width={300}
              height={48}
            />
          </div>

          <div style={{ width: '100%', borderRadius: '15px', overflow: 'hidden' }}>
            <audio 
              ref={audioRef} 
              controls 
              style={{ width: '100%', borderRadius: '15px' }} 
            >
              <source src="/nhac.mp3" type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            <button onClick={togglePlayPause} className="mt-2">
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <div>Current Time: {currentTime.toFixed(2)}s</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
