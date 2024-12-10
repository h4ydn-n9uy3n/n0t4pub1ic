import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

interface VideoUploadProps {
  emptySquareColor?: string;
  borderColor?: string;
  textColor?: string;
}

const VideoUpload = ({ 
  emptySquareColor = '#E0479E',
  borderColor = '#FF8FAB',
  textColor = '#553E4E'
}: VideoUploadProps) => {
  const [videoUrl, setVideoUrl] = useState<string>('/reoten.mov');  
  const [videoError, setVideoError] = useState<string>('');
  const [isClient, setIsClient] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setIsClient(true);
    const savedVideo = localStorage.getItem('videoData');
    if (savedVideo) {
      setVideoUrl(savedVideo);
    }

    // Add fullscreen change event listener
    const handleFullscreenChange = () => {
      const video = videoRef.current;
      if (!video) return;
      
      if (document.fullscreenElement) {
        video.style.objectFit = 'contain';
        video.style.backgroundColor = 'black';
      } else {
        video.style.objectFit = 'cover';
        video.style.backgroundColor = 'transparent';
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Video = reader.result as string;
          setVideoUrl(base64Video);
          localStorage.setItem('videoData', base64Video);
          toast.success('Video uploaded successfully');
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error uploading video:', error);
        toast.error('Error uploading video');
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const bounds = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - bounds.left) / bounds.width;
    const newTime = percent * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex flex-col items-center mt-8 mb-8">
      <div className="relative w-[250px] cursor-pointer group">
        <div 
          className="w-full rounded-xl overflow-hidden border-2 transition-transform duration-300 ease-in-out group-hover:scale-105 bg-[#E0479E]"
          style={{ borderColor }}
        >
          {isClient && videoUrl ? (
            <div className="w-full relative">
              <div className="relative group/video">
                <video 
                  ref={videoRef}
                  key={videoUrl}
                  className="w-full h-[400px] object-cover"
                  style={{
                    display: 'none',
                    marginBottom: '-6px',
                  }}
                  onError={(e) => {
                    console.error('Video error:', e);
                    setVideoError('Error loading video');
                  }}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  controlsList="nodownload"
                >
                  <source src={videoUrl} type="video/quicktime" />
                  <source src={videoUrl} type="video/mp4" />
                  {videoError || 'Your browser does not support the video tag.'}
                </video>

                {/* Play/Pause overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/video:opacity-100 transition-opacity">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-black/50 text-white">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      {isPlaying ? (
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                      ) : (
                        <path d="M8 5v14l11-7z"/>
                      )}
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div 
              className="w-full h-[400px] flex items-center justify-center"
              style={{ backgroundColor: emptySquareColor }}
              onClick={() => fileInputRef.current?.click()}
            >
              <span style={{ color: textColor }} className="text-lg">
                Click to Upload
              </span>
            </div>
          )}
        </div>

        {isClient && videoUrl && (
          <div className="mt-4 w-full space-y-2">
            <div className="flex items-center space-x-4">
              <button
                onClick={togglePlay}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  {isPlaying ? (
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                  ) : (
                    <path d="M8 5v14l11-7z"/>
                  )}
                </svg>
              </button>
              
              <div className="flex-1 flex flex-col space-y-1">
                <div 
                  className="h-1.5 bg-white/10 rounded-full cursor-pointer overflow-hidden"
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
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleVideoUpload}
          accept="video/*"
          className="hidden"
        />
      </div>
    </div>
  );
};

export default VideoUpload;