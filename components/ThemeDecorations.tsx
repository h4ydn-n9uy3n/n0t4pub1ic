import React from 'react';
import { ThemeNames } from '../utils/themes';
import { ImagePosition, BasePosition, WindowWithImageSet, CSSProperties } from '../types';

interface ThemeDecorationsProps {
  currentTheme: ThemeNames;
  isImageEnlarged: boolean;
}

// Image sets
const catImages = [
  // Root cat images
  '/cats/0064e636-408c-44d0-98e8-a860e1541c98.jpg',
  '/cats/Boobib Cuties Pop.png',
  '/cats/Cup of kitty\'s.jpg',
  '/cats/Ikon Kucing Lucu Merah Muda Hewan Png Yuri, Imut, Kucing, Clipart Kucing PNG Transparan Clipart dan File PSD untuk Unduh Gratis.png',
  '/cats/I❤cats.jpg',
  '/cats/Premium Vector _ Cute white cat cartoon, vector illustration.jpg',
  '/cats/Snaptik.app_74332530154794058323.jpg',
  '/cats/Snaptik.app_74332530154794058324.jpg',
  '/cats/Snaptik.app_74339702599813563093.png',
  '/cats/Snaptik.app_74351192240597107272.jpg',
  '/cats/Snaptik.app_74364034776238686803.png',
  '/cats/Snaptik.app_74364034776238686804.png',
  '/cats/Snaptik.app_74364034776238686805.jpg',
  '/cats/b9f316ae-af15-420c-b4b3-06bb4dfe22a8.jpg',
  '/cats/catpuccino by denufaw.jpg',
  '/cats/d73b4436-ece0-4c1d-be0e-a13f9df0db69.jpg',
  '/cats/download.jpg',
  '/cats/download (1).jpg',
  '/cats/download (2).jpg',
  '/cats/download (3).jpg',

  // Cafe cats
  '/cats/cafe-cats/cat-1.jpg',
  '/cats/cafe-cats/cat-2.jpg',
  '/cats/cafe-cats/cat-3.jpg',
  '/cats/cafe-cats/cat-4.jpg',
  '/cats/cafe-cats/cat-5.jpg',
  '/cats/cafe-cats/cat-6.jpg',
  '/cats/cafe-cats/cat-7.jpg',
  '/cats/cafe-cats/cat-8.jpg',
  '/cats/cafe-cats/cat-9.jpg',
  '/cats/cafe-cats/cat-10.jpg',
  '/cats/cafe-cats/cat-11.jpg',
  '/cats/cafe-cats/cat-12.jpg',
  '/cats/cafe-cats/cat-13.jpg',
  '/cats/cafe-cats/cat-14.jpg',
  '/cats/cafe-cats/cat-15.jpg',
  '/cats/cafe-cats/cat-16.jpg',
  '/cats/cafe-cats/cat-17.jpg',
  '/cats/cafe-cats/cat-18.jpg',
  '/cats/cafe-cats/cat-19.jpg',
  '/cats/cafe-cats/cat-20.jpg',

  // Pusheen cats
  '/cats/pusheen-cats/pusheen-1.jpg',
  '/cats/pusheen-cats/pusheen-2.jpg',
  '/cats/pusheen-cats/pusheen-3.jpg',
  '/cats/pusheen-cats/pusheen-4.jpg',
  '/cats/pusheen-cats/pusheen-5.jpg',
  '/cats/pusheen-cats/pusheen-6.jpg',
  '/cats/pusheen-cats/pusheen-7.jpg',
  '/cats/pusheen-cats/pusheen-8.jpg',
  '/cats/pusheen-cats/pusheen-9.jpg',
  '/cats/pusheen-cats/pusheen-10.jpg',
  '/cats/pusheen-cats/pusheen-11.jpg',
  '/cats/pusheen-cats/pusheen-12.jpg',
  '/cats/pusheen-cats/pusheen-13.jpg',
  '/cats/pusheen-cats/pusheen-14.jpg',
  '/cats/pusheen-cats/pusheen-15.jpg',
  '/cats/pusheen-cats/pusheen-16.jpg',
  '/cats/pusheen-cats/pusheen-17.jpg',
  '/cats/pusheen-cats/pusheen-18.jpg',
  '/cats/pusheen-cats/pusheen-19.jpg',
  '/cats/pusheen-cats/pusheen-20.jpg',
  '/cats/pusheen-cats/pusheen-21.jpg',
  '/cats/pusheen-cats/pusheen-22.jpg',
  '/cats/pusheen-cats/pusheen-23.jpg',
  '/cats/pusheen-cats/pusheen-24.jpg',
  '/cats/pusheen-cats/pusheen-25.jpg',
  '/cats/pusheen-cats/pusheen-26.jpg',
  '/cats/pusheen-cats/pusheen-27.jpg',
  '/cats/pusheen-cats/pusheen-28.jpg',
  '/cats/pusheen-cats/pusheen-29.jpg',
  '/cats/pusheen-cats/pusheen-30.jpg',
  '/cats/pusheen-cats/pusheen-31.jpg',
  '/cats/pusheen-cats/pusheen-32.jpg',
  '/cats/pusheen-cats/pusheen-33.jpg',
  '/cats/pusheen-cats/pusheen-34.jpg',
  '/cats/pusheen-cats/pusheen-35.jpg',
  '/cats/pusheen-cats/pusheen-36.jpg',
  '/cats/pusheen-cats/pusheen-37.jpg',
  '/cats/pusheen-cats/pusheen-38.jpg',
];

const screenshotImages = [
  '/screenshots/IMG_0817.PNG',
  '/screenshots/IMG_0818.PNG',
  '/screenshots/IMG_0863.jpg',
  '/screenshots/IMG_0864.jpg',
  '/screenshots/IMG_0865.jpg',
  '/screenshots/IMG_0866.jpg',
  '/screenshots/IMG_0867.jpg',
  '/screenshots/IMG_0868.jpg',
  '/screenshots/IMG_0869.jpg',
  '/screenshots/IMG_0870.jpg',
  '/screenshots/Screenshot 2024-11-23 132845.png',
  '/screenshots/Screenshot 2024-11-23 133414.png',
  '/screenshots/Screenshot 2024-11-23 133610.png',
  '/screenshots/Screenshot 2024-11-23 133621.png',
  '/screenshots/Screenshot 2024-11-23 133640.png',
  '/screenshots/Screenshot 2024-11-23 133717.png',
  '/screenshots/Screenshot 2024-11-23 133833.png',
  '/screenshots/Screenshot 2024-11-23 133949.png',
  '/screenshots/Screenshot 2024-11-23 134023.png',
  '/screenshots/Screenshot 2024-11-23 134057.png',
  '/screenshots/Screenshot 2024-11-23 134153.png',
  '/screenshots/Screenshot 2024-11-23 134207.png',
  '/screenshots/Screenshot 2024-11-23 134225.png',
  '/screenshots/Screenshot 2024-11-23 134342.png',
  '/screenshots/Screenshot 2024-11-23 134443.png',
  '/screenshots/Screenshot 2024-11-23 134526.png',
  '/screenshots/Screenshot 2024-11-23 134553.png',
  '/screenshots/Screenshot 2024-11-23 134659.png',
  '/screenshots/Screenshot 2024-11-23 134746.png',
  '/screenshots/Screenshot 2024-11-23 134838.png',
  '/screenshots/Screenshot 2024-11-23 135634.png',
  '/screenshots/Screenshot 2024-11-23 140728.png',
  '/screenshots/Screenshot 2024-11-23 140755.png',
  '/screenshots/Screenshot 2024-11-23 141013.png',
  '/screenshots/Screenshot 2024-11-23 141122.png',
  '/screenshots/Screenshot 2024-11-23 141200.png',
  '/screenshots/Screenshot 2024-11-23 141329.png',
  '/screenshots/Screenshot 2024-11-23 141356.png',
  '/screenshots/Screenshot 2024-11-23 141516.png',
  '/screenshots/Screenshot 2024-11-23 141540.png',
  '/screenshots/Screenshot 2024-11-23 141552.png',
  '/screenshots/Screenshot 2024-11-23 141959.png',
  '/screenshots/Screenshot 2024-11-23 142034.png',
  '/screenshots/Screenshot 2024-11-23 142054.png',
  '/screenshots/Screenshot 2024-11-23 142139.png',
  '/screenshots/Screenshot 2024-11-23 142206.png',
  '/screenshots/Screenshot 2024-11-23 142244.png',
  '/screenshots/Screenshot 2024-11-23 142408.png',
  '/screenshots/Screenshot 2024-11-23 142431.png',
  '/screenshots/Screenshot 2024-11-23 142517.png',
  '/screenshots/Screenshot 2024-11-23 142535.png',
  '/screenshots/Screenshot 2024-11-23 142619.png',
  '/screenshots/Screenshot 2024-11-23 142648.png',
  '/screenshots/Screenshot 2024-11-23 142706.png',
  '/screenshots/Screenshot 2024-11-23 142751.png',
  '/screenshots/Screenshot 2024-11-23 142820.png',
  '/screenshots/Screenshot 2024-11-23 142831.png',
  '/screenshots/Screenshot 2024-11-23 142858.png',
  '/screenshots/Screenshot 2024-11-23 142952.png',
  // New images
  '/screenshots/462216130_18072742648574958_8194411924155581845_n.jpg',
  '/screenshots/Snaptik.app_74203701183681856073.jpg',
  '/screenshots/Snaptik.app_74203701183681856075.jpg',
  '/screenshots/468191443_18077691958574958_6951970121353518850_n.jpg',
  '/screenshots/455009890_18067147624574958_172302745765034671_n.jpg',
  '/screenshots/447277888_18060684463574958_6338516620359388806_n.jpg',
  '/screenshots/383635196_6601807116593276_425118430585773838_n.jpg',
  '/screenshots/467550808_18077691997574958_530520516903219837_n.jpg',
  '/screenshots/442384562_18059067919574958_3541958803556035245_n.jpg',
  '/screenshots/462432760_18073057471574958_9518751970321944_n.jpg',
  '/screenshots/462139596_18072742699574958_7616152482493014618_n.jpg',
  '/screenshots/Screenshot 2024-11-30 183928.jpg',
  '/screenshots/Screenshot 2024-11-30 183928.png',
  '/screenshots/Screenshot 2024-11-30 183969.png'
];

const fallbackImage = '/cats/download.jpg';

const getRingColorForTheme = (theme: ThemeNames): string => {
  switch (theme) {
    case 'happy':
      return 'ring-pink-400';
    case 'calm':
      return 'ring-green-400';
    default:
      return 'ring-gray-400';
  }
};

const getRingColor = (isDark: boolean) => {
  if (isDark) {
    return 'ring-purple-400 hover:ring-purple-300';
  }
  return 'ring-pink-400 hover:ring-pink-300';
};

const ThemeDecorations: React.FC<ThemeDecorationsProps> = ({ currentTheme, isImageEnlarged }) => {
  // Initialize state variables
  const [loadedImages, setLoadedImages] = React.useState<string[]>([]);
  const [errorImages, setErrorImages] = React.useState<string[]>([]);
  const [imagePositions, setImagePositions] = React.useState<{ [key: string]: ImagePosition }>({});
  const [scrollY, setScrollY] = React.useState(0);
  const [showCats, setShowCats] = React.useState(true);

  // Change image set based on mood only on initial render
  React.useEffect(() => {
    const win = window as WindowWithImageSet;
    const hasUserToggled = win.hasUserToggledImageSet;
    if (!hasUserToggled) {
      setShowCats(true);
    }
  }, [currentTheme]);

  // Expose toggle function for external use
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const win = window as WindowWithImageSet;
      win.toggleImageSet = () => {
        win.hasUserToggledImageSet = true; // Mark that user has made a choice
        setShowCats(prev => !prev);
      };
    }
  }, []);

  // Reset positions when switching image sets or scrolling
  React.useEffect(() => {
    setImagePositions({});
  }, [showCats]);

  // Theme-based styling
  const ringColor = React.useMemo(() => {
    return 'ring-pink-400 hover:ring-pink-300';
  }, []);

  // Get current image set
  const currentImages = React.useMemo(() => 
    showCats ? catImages : screenshotImages
  , [showCats]);

  // Debug logging
  React.useEffect(() => {
    console.log('Current loaded images:', loadedImages);
    console.log('Failed images:', errorImages);
  }, [loadedImages, errorImages]);

  // Track if this is the initial render
  const isInitialRender = React.useRef(true);

  // Generate stable random positions for consistent positioning
  const generateStableRandomPositions = React.useCallback((count: number, isRight: boolean): BasePosition[] => {
    return Array(count).fill(0).map((_, index) => {
      // Use index as stable seed for consistency
      const seed = index * 1000;
      const randomGenerator = () => {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
      };

      // Create scattered bubble positions within viewport bounds
      const baseX = isRight ? 
        randomGenerator() * 900 : // Right side: 0 to 900px from edge
        -(randomGenerator() * -1200 + 100); // Left side: -500 to -100px from edge
      
      // Distribute vertically within a fixed height
      const totalHeight = 6400; // Fixed total height
      const segmentHeight = totalHeight / count;
      const baseY = index * segmentHeight;
      const randomY = randomGenerator() * (segmentHeight * 0.5);
      const finalY = baseY + randomY;

      return {
        scale: 0.32 + randomGenerator() * 0.21, // Increased from 0.3 + random * 0.2
        y: finalY,
        x: baseX,
      };
    });
  }, []);

  // Calculate positions for both sides
  const leftBasePositions = React.useMemo(() => 
    generateStableRandomPositions(currentImages.length, false),
    [generateStableRandomPositions, currentImages]
  );

  const rightBasePositions = React.useMemo(() => 
    generateStableRandomPositions(currentImages.length, true),
    [generateStableRandomPositions, currentImages]
  );

  // Generate random movement for floating bubbles
  const getRandomMovement = React.useCallback((src: string): ImagePosition => {
    const seed = src.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const time = Date.now() / 3000; // Slower, more gentle floating

    // Create gentle floating motion with varying phases
    const floatX = Math.sin(time + seed) * 25; // Increased range for more noticeable movement
    const floatY = Math.cos(time + seed * 1.5) * 30;

    return {
      x: floatX,
      y: floatY,
    };
  }, []);

  // Update positions continuously for floating effect
  React.useEffect(() => {
    const updatePositions = () => {
      const newPositions: { [key: string]: ImagePosition } = {};
      currentImages.forEach((src) => {
        newPositions[src] = getRandomMovement(src);
      });
      setImagePositions(newPositions);
    };

    // Update more frequently for smoother animation
    const intervalId = setInterval(updatePositions, 50);
    return () => clearInterval(intervalId);
  }, [getRandomMovement, currentImages]);

  // Get theme-based transform with subtle movements
  const getThemeTransform = React.useCallback((isRight: boolean) => {
    let x = 0;
    const multiplier = isRight ? 1 : -1;

    switch (currentTheme) {
      case 'happy':
        x = 30 * multiplier;
        break;
      case 'calm':
        x = -15 * multiplier;
        break;
      default:
        x = 0;
    }

    return x;
  }, [currentTheme]);

  // Store transforms in state
  const [leftTransform, setLeftTransform] = React.useState(() => getThemeTransform(false));
  const [rightTransform, setRightTransform] = React.useState(() => getThemeTransform(true));

  // Handle image load success
  const handleImageLoad = React.useCallback((src: string) => {
    console.log('Image loaded successfully:', src);
    setLoadedImages(prev => {
      if (!prev.includes(src)) {
        return [...prev, src];
      }
      return prev;
    });
  }, []);

  // Handle image load error
  const handleImageError = React.useCallback((src: string) => {
    console.error('Image failed to load:', src);
    setErrorImages(prev => {
      if (!prev.includes(src)) {
        return [...prev, src];
      }
      return prev;
    });
  }, []);

  // Theme change effect
  React.useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    requestAnimationFrame(() => {
      setLeftTransform(getThemeTransform(false));
      setRightTransform(getThemeTransform(true));
    });
  }, [currentTheme, getThemeTransform]);

  // Reset failed images when theme changes
  React.useEffect(() => {
    setErrorImages([]);
  }, [currentTheme]);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Split images into left and right sides
  const midPoint = Math.ceil(currentImages.length / 2);
  const leftSideImages = currentImages.slice(0, midPoint);
  const rightSideImages = currentImages.slice(midPoint);

  // Render container with floating bubbles
  const renderContainer = (images: string[], isRight: boolean) => {
    const positions = isRight ? rightBasePositions : leftBasePositions;
    const transform = isRight ? rightTransform : leftTransform;
    const side = isRight ? 'right' : 'left';

    return (
      <div 
        className={`absolute top-0 ${side}-0 w-1/2 pointer-events-none transition-opacity duration-300`}
        style={{ 
          height: '3000px',
          opacity: isImageEnlarged ? 0 : 1
        }}
      >
        {images.map((src, index) => {
          const position = positions[index];
          if (!position) return null;

          const isLoaded = loadedImages.includes(src);
          const movement = imagePositions[src] || { x: 0, y: 0 };

          const imageStyle: CSSProperties = {
            position: 'absolute',
            [side]: isRight ? '0%' : '0%', 
            top: position.y,
            transform: `translate(${position.x + transform + movement.x}px, ${movement.y}px) scale(${position.scale * 1.02})`, 
            transition: 'transform 1000ms cubic-bezier(0.4, 0, 0.2, 1), opacity 400ms cubic-bezier(0.4, 0, 0.2, 1)',
            willChange: 'transform',
            opacity: isLoaded ? (isImageEnlarged ? 0.25 : 1) : 0,
            width: '163px', 
            height: '163px',
            zIndex: isImageEnlarged ? 1 : 20,
            pointerEvents: (isImageEnlarged ? 'none' : 'auto') as 'none' | 'auto'
          };

          return (
            <div
              key={`${side}-${src}`}
              style={imageStyle}
            >
              <div className={`
                w-full h-full
                relative rounded-full overflow-hidden
                ring-4 ring-opacity-60 shadow-lg
                ${ringColor}
                hover:scale-110 transition-all duration-1000 ease-in-out
                ${'hover:shadow-pink-400/50'}
              `}>
                <img
                  src={src}
                  alt="Decorative cat"
                  className="w-full h-full object-cover"
                  onLoad={() => handleImageLoad(src)}
                  onError={() => handleImageError(src)}
                  loading="lazy"
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ height: '3000px', zIndex: 9999 }}>
      {renderContainer(leftSideImages, false)}
      {renderContainer(rightSideImages, true)}
    </div>
  );
};

export default ThemeDecorations;
