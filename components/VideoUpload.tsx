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
  const [isLoaded, setIsLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setIsClient(true);
    // Only use localStorage if it's a base64 video
    const savedVideo = localStorage.getItem('videoData');
    if (savedVideo?.startsWith('data:video')) {
      setVideoUrl(savedVideo);
    }
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

  const handleVideoLoad = () => {
    setIsLoaded(true);
    setVideoError('');
  };

  const handleVideoError = (e: any) => {
    console.error('Video error:', e);
    setVideoError('Error loading video');
    setIsLoaded(false);
    toast.error('Error loading video. Please try refreshing the page.');
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
          {isClient ? (
            <div className="w-full h-full relative">
              {!isLoaded && !videoError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <span className="text-gray-500">Loading video...</span>
                </div>
              )}
              {videoUrl && (
                <video 
                  ref={videoRef}
                  key={videoUrl}
                  controls 
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{
                    marginBottom: '-6px',
                    opacity: isLoaded ? 1 : 0,
                  }}
                  onLoadedData={handleVideoLoad}
                  onError={handleVideoError}
                  controlsList="nodownload"
                  playsInline
                  preload="auto"
                  muted
                  autoPlay
                  loop
                >
                  <source src={videoUrl} type="video/quicktime" />
                  <source src={videoUrl} type="video/mp4" />
                  <source src={videoUrl} type="video/mov" />
                  <source src={videoUrl} />
                  {videoError || 'Your browser does not support the video tag.'}
                </video>
              )}
              {videoError && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-50">
                  <span className="text-red-500">Failed to load video</span>
                </div>
              )}
            </div>
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: emptySquareColor }}
              onClick={() => fileInputRef.current?.click()}
            >
              <span style={{ color: textColor }} className="text-lg">
                Loading...
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