import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

interface VideoUploadProps {
  emptySquareColor?: string;
  borderColor?: string;
  textColor?: string;
  videoUrl?: string;
}

const VideoUpload = ({ 
  emptySquareColor = '#E0479E',
  borderColor = '#FF8FAB',
  textColor = '#553E4E',
  videoUrl: initialVideoUrl = '/reoten.mov'
}: VideoUploadProps) => {
  const [videoUrl, setVideoUrl] = useState<string>(initialVideoUrl);
  const [videoError, setVideoError] = useState<string>('');
  const [isClient, setIsClient] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setIsClient(true);
    // Only use localStorage if it's a base64 video
    const savedVideo = localStorage.getItem('videoData');
    if (savedVideo?.startsWith('data:video')) {
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

  return (
    <div className="flex flex-col items-center mt-8 mb-8">
      <div 
        className="relative w-[250px] h-[400px] cursor-pointer group"
      >
        <div 
          className="w-full h-full rounded-xl overflow-hidden border-2 transition-transform duration-300 ease-in-out group-hover:scale-105 bg-[#E0479E]"
          style={{ borderColor }}
        >
          {isClient && videoUrl ? (
            <div className="w-full h-full relative">
              <video 
                ref={videoRef}
                key={videoUrl}
                controls 
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  marginBottom: '-6px',
                }}
                onError={(e) => {
                  console.error('Video error:', e);
                  setVideoError('Error loading video');
                  toast.error('Error loading video');
                }}
                controlsList="nodownload"
                playsInline
                preload="metadata"
              >
                <source src={videoUrl} type="video/quicktime" />
                <source src={videoUrl} type="video/mp4" />
                <source src={videoUrl} type="video/mov" />
                {videoError || 'Your browser does not support the video tag.'}
              </video>
            </div>
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: emptySquareColor }}
              onClick={() => fileInputRef.current?.click()}
            >
              <span style={{ color: textColor }} className="text-lg">
                Click to Upload
              </span>
            </div>
          )}
        </div>
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