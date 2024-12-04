import { useState, useRef, useEffect } from 'react';
import ProfileHeader from '../components/ProfileHeader';
import ImageGrid from '../components/ImageGrid';
import VideoUpload from '../components/VideoUpload';
import { Toaster } from 'sonner';
import { themes, ThemeNames } from '../utils/themes';
import { extractColors } from '../utils/colorExtractor';
import ThemeDecorations from '../components/ThemeDecorations';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

const DEFAULT_BG = "/webbg2.png";

export default function Home() {
  const { data: session, status } = useSession();
  const [currentTheme, setCurrentTheme] = useState<ThemeNames>('happy');
  const [customTheme, setCustomTheme] = useState<null | {
    pageBackground: string;
    headerBackground: string;
    fontColor: string;
    emptySquareColor: string;
    borderColor: string;
    gradientColors: {
      from: string;
      via: string;
      to: string;
    };
  }>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [showBackground, setShowBackground] = useState(false);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string>('');
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [isImageEnlarged, setIsImageEnlarged] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedBg = localStorage.getItem('backgroundFileName');
    if (savedBg) {
      setBackgroundImage(savedBg);
      handleImageColors(savedBg);
    }
    const savedShowBackground = localStorage.getItem('showBackground');
    if (savedShowBackground) {
      setShowBackground(savedShowBackground === 'true');
    }
  }, []);

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  const theme = customTheme || themes[currentTheme];

  const handleImageColors = async (imageUrl: string) => {
    try {
      const colors = await extractColors(imageUrl);
      setCustomTheme({
        pageBackground: colors.mainColor,
        headerBackground: colors.secondaryColor,
        fontColor: '#000000',
        emptySquareColor: colors.accentColor,
        borderColor: colors.secondaryColor,
        gradientColors: {
          from: colors.mainColor,
          via: colors.secondaryColor,
          to: colors.accentColor
        }
      });
      setCurrentTheme('custom' as ThemeNames);
    } catch (error) {
      console.error('Failed to extract colors:', error);
      // toast.error('Failed to extract colors from image');
    }
  };

  const handleBackgroundUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
        }

        const newObjectUrl = URL.createObjectURL(file);
        setObjectUrl(newObjectUrl);
        setBackgroundImage(newObjectUrl);
        setShowBackground(true);
        localStorage.setItem('backgroundFileName', file.name);
        await handleImageColors(newObjectUrl);
      } catch (error) {
        console.error('Failed to process image:', error);
      }
    }
  };

  const handleBackgroundUrlChange = async (url: string) => {
    if (!url.trim()) return;
    try {
      const fullUrl = url.startsWith('http') ? url : `https://${url}`;
      setBackgroundImage(fullUrl);
      setShowBackground(true);
      localStorage.setItem('backgroundUrl', fullUrl);
      await handleImageColors(fullUrl);
      setBackgroundImageUrl('');
    } catch (error) {
      console.error('Failed to set background from URL:', error);
    }
  };

  const handleRemoveBackground = () => {
    setShowBackground(false);
    setBackgroundImage(null);
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      setObjectUrl(null);
    }
    localStorage.removeItem('backgroundUrl');
    localStorage.removeItem('backgroundFileName');
    setCurrentTheme('happy');
    setCustomTheme(null);
  };

  const handleImageClick = () => {
    setIsImageEnlarged(prev => !prev);
  };

  // Function to toggle image set
  const toggleImageSet = () => {
    if (typeof window !== 'undefined' && (window as any).toggleImageSet) {
      (window as any).toggleImageSet();
    }
  };

  return (
    <div 
      className="min-h-screen transition-all duration-300" 
      style={{ 
        backgroundColor: theme?.pageBackground || '#FFCFD2',
        ...(showBackground && backgroundImage ? {
          backgroundImage: `url("${backgroundImage}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        } : {})
      }}
    >
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-xl font-bold text-indigo-600">
                  This Is For You
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              {status === 'loading' ? (
                <div>Loading...</div>
              ) : session ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">Welcome, {session.user.email}</span>
                  <button
                    onClick={() => signOut()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-x-4">
                  <Link
                    href="/auth/signin"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div 
        className="min-h-screen"
        style={{ 
          backgroundColor: showBackground ? 'transparent' : (theme?.pageBackground || '#FFCFD2')
        }}
      >
        <ThemeDecorations currentTheme={currentTheme} isImageEnlarged={isImageEnlarged} />
        <div 
          className="min-h-screen" 
          style={{ 
            color: theme?.fontColor || '#553E4E',
            borderColor: theme?.borderColor || '#FF8FAB'
          }}
        >
          <Toaster position="top-center" />
          
          {/* Background controls */}
          <div className={`
            fixed right-4 top-4 flex flex-col gap-3 z-10 bg-white/10 backdrop-blur-md p-4 rounded-lg shadow-lg border border-white/20
            transition-all duration-300
            ${isImageEnlarged ? 'opacity-25 pointer-events-none blur-sm' : ''}
          `}>            
            {/* URL input */}
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={backgroundImageUrl}
                onChange={(e) => setBackgroundImageUrl(e.target.value)}
                placeholder="Enter image URL..."
                className="px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-gray-800 placeholder-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 transition-all w-[250px]"
              />
              <button
                onClick={() => handleBackgroundUrlChange(backgroundImageUrl)}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-gray-800 rounded-lg transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                  />
                </svg>
                Set URL
              </button>
            </div>
            
            {/* Divider */}
            <div className="h-px bg-white/20 w-full"></div>
            
            {/* File upload */}
            <div className="flex flex-col gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleBackgroundUpload}
                className="hidden"
                ref={fileInputRef}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-gray-800 rounded-lg transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Upload Image
              </button>
              {showBackground && (
                <button
                  onClick={handleRemoveBackground}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-900 rounded-lg transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Remove Background
                </button>
              )}
            </div>
          </div>

          {/* Theme selector */}
          <div className={`
            fixed left-4 top-4 flex flex-col gap-3 z-10 bg-white/10 backdrop-blur-md p-4 rounded-lg shadow-lg border border-white/20
            transition-all duration-300
            ${isImageEnlarged ? 'opacity-25 pointer-events-none blur-sm' : ''}
          `}>
            <div className="flex flex-col gap-2">
              {(Object.keys(themes) as ThemeNames[]).map((themeName) => {
                const themeData = themes[themeName];
                return (
                  <button 
                    key={themeName}
                    onClick={() => {
                      setCurrentTheme(themeName);
                      setCustomTheme(null);
                      // Don't clear background image when changing themes
                    }}
                    className={`
                      flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs
                      transition-all duration-300 hover:scale-105
                      ${currentTheme === themeName && !customTheme && !showBackground
                        ? 'bg-white shadow-lg scale-105' 
                        : 'bg-white/50 hover:bg-white/80'
                      }
                    `}
                  >
                    <span className="text-base">{themeData.mood}</span>
                    <span style={{ color: themeData.fontColor }}>{themeData.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="max-w-[850px] mx-auto px-4">
            <div className="pt-8">
              <div className="relative z-10">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-center items-center">
                    <ProfileHeader 
                      background={theme.headerBackground}
                      textColor={theme.fontColor}
                      gradientColors={theme.gradientColors}
                      toggleImageSet={toggleImageSet}
                      currentTheme={currentTheme}
                      onImageEnlargedChange={setIsImageEnlarged}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                {/* First cat images container */}
                <div className="w-[800px] mx-auto">
                  <ImageGrid 
                    type={1} 
                    emptySquareColor={theme.emptySquareColor}
                    borderColor={theme.borderColor}
                    textColor={theme.fontColor}
                  />
                </div>
                {/* Second cat images container */}
                <div className="w-[800px] mx-auto">
                  <ImageGrid 
                    type={2} 
                    emptySquareColor={theme.emptySquareColor}
                    borderColor={theme.borderColor}
                    textColor={theme.fontColor}
                  />
                </div>
              </div>
              <div className="w-[800px] mx-auto">
                <ImageGrid 
                  type={3} 
                  emptySquareColor={theme.emptySquareColor}
                  borderColor={theme.borderColor}
                  textColor={theme.fontColor}
                />
              </div>
              <div className="flex justify-center">
                <VideoUpload 
                  emptySquareColor={theme.emptySquareColor}
                  borderColor={theme.borderColor}
                  textColor={theme.fontColor}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}