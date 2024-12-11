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
                <div style={{ width: '100%', borderRadius: '15px' }}>
                  <div className="mt-4 w-full space-y-2">
                    <video
                      ref={videoRef}
                      controls
                      className="w-full rounded-lg"
                      src={videoUrl}
                    >
                      {videoError || 'Your browser does not support the video tag.'}
                    </video>
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