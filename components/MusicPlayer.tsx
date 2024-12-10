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
  const [error, setError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
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

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.currentTime >= 12) {
        setShowTitle(true);
      } else {
        setShowTitle(false);
      }
    };

    const handleLoadedMetadata = () => {
      console.log('Audio metadata loaded');
      setDuration(audio.duration);
      setError(null);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      setShowTitle(false);
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

    // Add event listeners
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // Initial load
    audio.load();

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      
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
    if (!audioRef.current || !audioReady) return;

    try {
      // Initialize audio context on first play
      if (!audioContextRef.current) {
        await initAudioContext();
      }

      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        if (audioRef.current.ended) {
          audioRef.current.currentTime = 0;
          setShowTitle(false);
        }

        // Resume audio context if suspended
        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }

        await audioRef.current.play();
        setIsPlaying(true);
        setError(null);
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
      setError('Error playing audio');
      setIsPlaying(false);
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
    <div className={`flex flex-col space-y-4 ${className}`}>
      <div className="h-5">
        {showTitle && (
          <div className="text-center text-sm text-white/80 font-medium animate-fade-in">
            {audioFiles[0].title}
          </div>
        )}
        {error && (
          <div className="text-center text-sm text-red-400 font-medium animate-fade-in">
            {error}
          </div>
        )}
      </div>
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-4">
          <button
            onClick={togglePlay}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
              audioReady ? 'bg-white/10 hover:bg-white/20' : 'bg-white/5 cursor-wait'
            }`}
            disabled={!audioReady}
            aria-label={isPlaying ? 'Pause music' : 'Play music'}
          >
            {isPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            ) : (
              <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>
          
          <div className="flex-1 flex flex-col space-y-1">
            <div 
              className="h-1 bg-white/10 rounded-full cursor-pointer overflow-hidden"
              onClick={handleSeek}
            >
              <div 
                className="h-full bg-white/80 transition-all duration-100"
                style={{ width: `${(currentTime / duration) * 100}%` }}
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
      </div>
    </div>
  );
};

export default MusicPlayer;
