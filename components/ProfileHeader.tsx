import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import MusicPlayer from './MusicPlayer';
import Image from 'next/image';
import { ThemeNames } from '../utils/themes';

interface ProfileHeaderProps {
  background: string;
  textColor: string;
  gradientColors: {
    from: string;
    via: string;
    to: string;
  };
  toggleImageSet: () => void;
  currentTheme: ThemeNames;
  onImageEnlargedChange: (enlarged: boolean) => void;
}

const MAX_WIDTH = 400;
const MIN_WIDTH = 200;

const getButtonColors = (theme: ThemeNames) => {
  switch (theme) {
    case 'happy':
      return {
        bg: '#e0479e',
        hover: '#c23c87'
      };
    case 'calm':
      return {
        bg: '#98C1D9',
        hover: '#7BA7C2'
      };
    case 'energetic':
      return {
        bg: '#F7B267',
        hover: '#E39B51'
      };
    case 'loved':
      return {
        bg: '#FF6B6B',
        hover: '#E85555'
      };
    case 'blessed':
      return {
        bg: '#4ECDC4',
        hover: '#38B7AE'
      };
    case 'cozy':
      return {
        bg: '#D4A373',
        hover: '#BC8C5F'
      };
    case 'peaceful':
      return {
        bg: '#A8E6CF',
        hover: '#8CCDB5'
      };
    case 'romantic':
      return {
        bg: '#FFB5E8',
        hover: '#E69ED1'
      };
    case 'dreamy':
      return {
        bg: '#B8B8FF',
        hover: '#9F9FE6'
      };
    default:
      return {
        bg: '#ec4899',
        hover: '#db2777'
      };
  }
};

const ProfileHeader = ({ 
  background = '#ffd1dc',
  textColor = '#553E4E',
  gradientColors = {
    from: 'yellow',
    via: 'red',
    to: 'purple'
  },
  toggleImageSet,
  currentTheme,
  onImageEnlargedChange
}: ProfileHeaderProps) => {
  const [isClient, setIsClient] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsClient(true);
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const base64String = e.target?.result as string;
        setProfileImage(base64String);
        setSelectedImage(null);
        onImageEnlargedChange(false);
        localStorage.setItem('profileImage', base64String);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error uploading image');
    }
  };

  const handleLocalImageClick = () => {
    if (profileImage) {
      setSelectedImage(profileImage);
      onImageEnlargedChange(true);
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleEnlargedImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleOverlayClick = () => {
    setSelectedImage(null);
    onImageEnlargedChange(false);
  };

  return (
    <div 
      className="mt-10 mb-20 p-5 w-[700px] mx-auto rounded-xl shadow-lg animate-fadeIn transition-colors duration-300 relative z-0"
      style={{ backgroundColor: background }}
    >
      {/* Music Player and Toggle Button Container */}
      <div className={`
        absolute top-4 right-4 flex flex-col items-end space-y-4 z-10
        transition-all duration-300
        ${selectedImage ? 'opacity-30 pointer-events-none blur-sm z-[-1]' : ''}
      `}>
        {/* Music Player */}
        <div className="w-64">
          <MusicPlayer audioFiles={[
            {
              url: '/audio/mynhan.ogg',
              title: 'New Audio Track'
            }
          ]} className="text-white" />
        </div>
        {/* Image Set Toggle Button */}
        <button 
          onClick={toggleImageSet}
          className="px-4 py-2 rounded-full w-fit text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
          style={{
            backgroundColor: getButtonColors(currentTheme).bg
          }}
          aria-label="Switch Image Set"
        >
          Switch Image Set
        </button>
      </div>

      <div className="flex flex-col">
        {/* Profile section with text and images */}
        <div className={`
          profile-container relative mt-2 flex items-center
          transition-all duration-300
          ${selectedImage ? 'opacity-30 pointer-events-none blur-sm' : ''}
        `}>
          {/* Profile Image */}
          <div 
            className="w-32 h-32 relative cursor-pointer"
            onClick={handleLocalImageClick}
            role="button"
            aria-label="Upload or change profile picture"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleLocalImageClick();
              }
            }}
          >
            {/* Gradient Ring */}
            <div 
              className="absolute inset-0 rounded-full"
              style={{ 
                background: `linear-gradient(to bottom right, ${gradientColors.from}, ${gradientColors.via}, ${gradientColors.to})`
              }}
            />
            {/* Image Container */}
            <div className={`
              absolute overflow-hidden bg-white transition-all duration-300 rounded-full
              ${selectedImage ? 'inset-4' : 'inset-1.5'}
            `}>
              {isClient && profileImage ? (
                <div className="relative w-full h-full">
                  <Image
                    src={profileImage}
                    alt="Profile"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                    className="object-cover"
                  />
                </div>
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center"
                  style={{ backgroundColor: gradientColors.from }}
                >
                  <span style={{ color: textColor }} className="text-sm">Upload</span>
                </div>
              )}
            </div>
          </div>

          {/* Hidden file input for image upload */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />

          {/* Text and Social Links */}
          <div className="ml-12">
            <h1 
              className="font-['Exo'] font-medium text-2xl"
              style={{ color: textColor }}
            >
              hang.elsa
            </h1>
            <p 
              className="font-['Rouge_Script'] text-[24pt] font-bold mt-0.1"
              style={{ color: textColor }}
            >
              Sa
            </p>
            {/* Social Media Links */}
            <div className="flex space-x-4 mt-4">
              <a
                href="https://www.instagram.com/hang.elsa/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-800 hover:text-[#E4405F] transition-colors duration-300"
                aria-label="Visit Instagram profile"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.772 1.153 4.902 4.902 0 01-1.153 1.772c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/hang.esla/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-800 hover:text-[#1877F2] transition-colors duration-300"
                aria-label="Visit Facebook profile"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@hangelsa?lang=en"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-800 hover:text-black transition-colors duration-300"
                aria-label="Visit TikTok profile"
              >
                <svg 
                  className="w-6 h-6" 
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02c.08 1.53.63 3.09 1.75 4.17c1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97c-.57-.26-1.1-.59-1.62-.93c-.01 2.92.01 5.84-.02 8.75c-.08 1.4-.54 2.79-1.35 3.94c-1.31 1.92-3.58 3.17-5.91 3.21c-1.43.08-2.86-.31-4.08-1.03c-2.02-1.19-3.44-3.37-3.65-5.71c-.02-.5-.03-1-.01-1.49c.18-1.9 1.12-3.72 2.58-4.96c1.66-1.44 3.98-2.13 6.15-1.72c.02 1.48-.04 2.96-.04 4.44c-.99-.32-2.15-.23-3.02.37c-.63.41-1.11 1.04-1.36 1.75c-.21.51-.15 1.07-.14 1.61c.24 1.64 1.82 3.02 3.5 2.87c1.12-.01 2.19-.66 2.77-1.61c.19-.33.4-.67.41-1.06c.1-1.79.06-3.57.07-5.36c.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Header Image */}
          <div className={`
            w-[150px] h-[150px] absolute top-[-41px] right-[240px] overflow-hidden rounded-lg
            transition-all duration-300
            ${selectedImage ? 'opacity-30 pointer-events-none blur-sm' : ''}
          `}>
            <Image
              src="/cats/Snaptik.app_74339702599813563092.png"
              alt="Header Image"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {selectedImage && (
        <>
          {/* Background Overlay */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[99998] pointer-events-auto"
            onClick={handleOverlayClick}
          />

          {/* Enlarged Image Modal */}
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center"
            onClick={handleOverlayClick}
          >
            {/* Enlarged Image */}
            <div
              className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full overflow-hidden cursor-pointer group"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage}
                alt="Enlarged profile"
                fill
                sizes="(max-width: 768px) 300px, 400px"
                className="object-cover rounded-full"
                priority
              />
              {/* Hover Overlay */}
              <div 
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                onClick={handleEnlargedImageClick}
              >
                <span className="text-white text-lg font-medium">Click to change</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileHeader;