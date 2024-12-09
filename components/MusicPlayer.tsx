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
  
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const getAbsoluteUrl = (url: string) => {
    // If it's already an absolute URL, return it
    if (url.startsWith('http')) return url;
    // If it's a relative URL, make it absolute
    return `${window.location.origin}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  useEffect(() => {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    const videoUrl = getAbsoluteUrl('output.mp4');
    console.log('Constructed video URL:', videoUrl);
    video.src = videoUrl;
    videoRef.current = video;

    video.addEventListener('canplay', () => setAudioReady(true));
    video.addEventListener('loadedmetadata', () => {
      setDuration(video.duration);
      setError(null);
    });
    video.addEventListener('ended', () => {
      setIsPlaying(false);
      setCurrentTime(0);
      setShowTitle(false);
      video.currentTime = 0;
    });
    video.addEventListener('error', (e: any) => {
      console.error('Attempting to load video from:', video.src);
      const error = e.target?.error;
      console.error('Video error:', {
        code: error?.code,
        message: error?.message,
        networkState: video.networkState,
        readyState: video.readyState,
        currentSrc: video.currentSrc,
        error: error
      });

      let errorMessage = 'Error loading video';
      
      switch(error?.code) {
        case 1:
          errorMessage = 'Video loading aborted';
          break;
        case 2:
          errorMessage = 'Network error occurred';
          break;
        case 3:
          errorMessage = 'Video decoding failed';
          break;
        case 4:
          errorMessage = 'Video source not supported';
          break;
      }

      setError(`${errorMessage}. Please try refreshing the page.`);
      setAudioReady(false);
      setIsPlaying(false);

      // Try to recover by reloading with a new cache-busting parameter
      if (process.env.NODE_ENV === 'production') {
        setTimeout(() => {
          const baseUrl = getAbsoluteUrl('/audio/setnhac.mp3');
          const newUrl = `${baseUrl}?v=${Date.now()}`;
          console.log('Retrying with URL:', newUrl);
          if (videoRef.current) {
            videoRef.current.src = newUrl;
            videoRef.current.load();
          }
        }, 1000);
      }
    });

    return () => {
      video.pause();
      video.src = '';
    };
  }, []);

  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current?.pause();
    } else {
      videoRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`flex flex-col space-y-4 ${className}`}>
      <video ref={videoRef} style={{ display: 'none' }} />
      <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
      <div className="flex items-center space-x-4">
        <div className="flex-1 flex items-center space-x-2">
          <span className="text-xs opacity-60 min-w-[40px]">
            {formatTime(currentTime)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
