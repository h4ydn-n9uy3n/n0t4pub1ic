import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

interface GridProps {
  type: 1 | 2 | 3;
  emptySquareColor?: string;
  borderColor?: string;
  textColor?: string;
}

const MAX_WIDTH = 800;
const MAX_HEIGHT = 800;
const TARGET_FILE_SIZE = 800 * 1024;

const compressImage = async (dataUrl: string, initialQuality = 0.9): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = async () => {
      try {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round(height * MAX_WIDTH / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round(width * MAX_HEIGHT / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Could not get canvas context');
        }
        
        // Use better image rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Progressive compression with higher minimum quality
        let quality = initialQuality;
        let compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        
        while (compressedDataUrl.length > TARGET_FILE_SIZE && quality > 0.5) {
          quality -= 0.1;
          compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        // If still too large, try one more time with reduced dimensions
        if (compressedDataUrl.length > TARGET_FILE_SIZE) {
          width = Math.round(width * 0.9);
          height = Math.round(height * 0.9);
          canvas.width = width;
          canvas.height = height;
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);
          compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        resolve(compressedDataUrl);
      } catch (error) {
        console.error('Image compression error:', error);
        reject(error);
      }
    };
    img.onerror = (error) => {
      console.error('Image loading error:', error);
      reject(new Error('Failed to load image'));
    };
    img.src = dataUrl;
  });
};

const saveToLocalStorage = (key: string, value: string) => {
  try {
    // Try to save with compression if needed
    const compressed = value.length > 1024 * 1024 ? value : value;
    localStorage.setItem(key, compressed);
    return true;
  } catch (error) {
    console.error('localStorage error:', error);
    // Try to clear old data if storage is full
    try {
      localStorage.removeItem(key);
      localStorage.setItem(key, value);
      return true;
    } catch (retryError) {
      console.error('Failed to save after cleanup:', retryError);
      toast.error('Storage error: Image might be too large');
      return false;
    }
  }
};

const ImageGrid = ({ 
  type, 
  emptySquareColor = '#FFAFC5',
  borderColor = '#FF8FAB',
  textColor = '#553E4E'
}: GridProps) => {
  const [isClient, setIsClient] = useState(false);
  const [images, setImages] = useState<(string | null)[]>(Array(9).fill(null));
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    setIsClient(true);
    try {
      const savedImages = localStorage.getItem(`grid-${type}`);
      if (savedImages) {
        const parsedImages = JSON.parse(savedImages);
        console.log(`Loading images for grid ${type}:`, parsedImages);
        setImages(parsedImages);
      }
    } catch (error) {
      console.error('Error loading images:', error);
    }
  }, [type]);

  useEffect(() => {
    if (isClient) {
      try {
        console.log(`Saving images for grid ${type}:`, images);
        const success = saveToLocalStorage(`grid-${type}`, JSON.stringify(images));
        if (!success) {
          console.warn('Failed to save images to localStorage');
          // Try to clear other data to make space
          try {
            for (let i = 1; i <= 3; i++) {
              if (i !== type) {
                localStorage.removeItem(`grid-${i}`);
              }
            }
            // Try saving again
            const retrySuccess = saveToLocalStorage(`grid-${type}`, JSON.stringify(images));
            if (!retrySuccess) {
              console.error('Failed to save images even after cleanup');
            }
          } catch (error) {
            console.error('Error during storage cleanup:', error);
          }
        }
      } catch (error) {
        console.error('Error saving images:', error);
      }
    }
  }, [images, type, isClient]);

  const handleImageUpload = async (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Loading image:', file.name, 'Size:', file.size);
      
      try {
        const loadingToast = toast.loading('Processing image...');
        const reader = new FileReader();
        
        reader.onload = async () => {
          try {
            const result = reader.result as string;
            console.log('File read successfully, length:', result.length);
            
            // Create a temporary image to verify loading
            const tempImg = new Image();
            tempImg.onload = async () => {
              try {
                console.log('Image dimensions:', tempImg.width, 'x', tempImg.height);
                const compressedImage = await compressImage(result);
                console.log('Compressed image size:', compressedImage.length);
                
                const newImages = [...images];
                newImages[index] = compressedImage;
                setImages(newImages);
                
                // Verify the image is valid after compression
                const verifyImg = new Image();
                verifyImg.onload = () => {
                  console.log('Image verified after compression');
                  const success = saveToLocalStorage(`grid-${type}`, JSON.stringify(newImages));
                  toast.dismiss(loadingToast);
                  
                  if (success) {
                    toast.success('Image uploaded successfully');
                  } else {
                    toast.error('Failed to save image. Please try a smaller image.');
                  }
                };
                
                verifyImg.onerror = () => {
                  console.error('Failed to verify compressed image');
                  toast.dismiss(loadingToast);
                  toast.error('Error processing image. Please try again.');
                };
                
                verifyImg.src = compressedImage;
                
              } catch (error) {
                console.error('Error during compression:', error);
                toast.dismiss(loadingToast);
                toast.error('Error processing image. Please try again.');
              }
            };
            
            tempImg.onerror = (error) => {
              console.error('Error loading original image:', error);
              toast.dismiss(loadingToast);
              toast.error('Error loading image. Please try a different image.');
            };
            
            tempImg.src = result;
          } catch (error) {
            console.error('Error processing image data:', error);
            toast.dismiss(loadingToast);
            toast.error('Error processing image. Please try a different image.');
          }
        };
        
        reader.onerror = (error) => {
          console.error('Error reading file:', error);
          toast.dismiss(loadingToast);
          toast.error('Error reading image file');
        };
        
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error during upload:', error);
        toast.error('Error uploading image');
      }
    }
  };

  const handleSquareClick = (index: number) => {
    if (images[index]) {
      setSelectedImage(images[index]);
      setSelectedIndex(index);
    } else {
      fileInputRefs.current[index]?.click();
    }
  };

  const getSquareClassName = (index: number) => {
    const baseClasses = `
      relative rounded-xl overflow-hidden
      transform-gpu transition-all duration-[800ms] ease-out
      hover:scale-[1.02] cursor-pointer group
      border-2
      flex items-stretch justify-center
    `;

    // Type 1: Center square is double width
    if (type === 1) {
      if (index === 4) {
        return `${baseClasses} w-[520px] h-[250px]`;
      }
      if (index === 5) {
        return 'hidden';
      }
    }

    return `${baseClasses} w-[250px] h-[250px]`;
  };

  const gridClassName = () => {
    if (type === 1) {
      return 'grid grid-cols-3 gap-[10px] [&>div:nth-child(5)]:col-span-2';
    }
    return 'grid grid-cols-3 gap-[10px]';
  };

  return (
    <div className="mb-8">
      <div className={`${gridClassName()} max-w-[1200px] mx-auto`}>
        {Array.from({ length: 9 }).map((_, index) => {
          const image = images[index];
          return (
            <div
              key={index}
              className={getSquareClassName(index)}
              style={{ 
                borderColor,
                minHeight: '250px',
                display: type === 1 && index === 5 ? 'none' : 'flex',
                position: 'relative',
                overflow: 'hidden'
              }}
              onClick={() => handleSquareClick(index)}
            >
              {image ? (
                <img
                  src={image}
                  alt={`Grid ${type} Image ${index + 1}`}
                  className="w-full h-full object-cover transform-gpu transition-all duration-[800ms] ease-out group-hover:scale-100"
                  style={{ 
                    objectFit: 'cover',
                    width: '100%',
                    height: '100%',
                    display: 'block'
                  }}
                  onLoad={() => console.log(`Image ${index} loaded successfully`)}
                  onError={(e) => {
                    console.error(`Error loading image ${index}:`, e);
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    // Try to reload the image
                    if (image && !image.includes('?retry')) {
                      target.src = image + '?retry=1';
                    } else {
                      target.src = '';
                      toast.error(`Failed to load image ${index + 1}`);
                    }
                  }}
                />
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center"
                  style={{ 
                    backgroundColor: emptySquareColor,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 0
                  }}
                >
                  <span style={{ color: textColor }} className="text-lg">
                    Click to Upload
                  </span>
                </div>
              )}
              <input
                type="file"
                ref={(el: HTMLInputElement | null) => {
                  if (fileInputRefs.current) {
                    fileInputRefs.current[index] = el;
                  }
                }}
                onChange={(e) => handleImageUpload(index, e)}
                accept="image/*"
                className="hidden"
              />
            </div>
          );
        })}
      </div>

      {/* Modal for enlarged image */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => {
            setSelectedImage(null);
            setSelectedIndex(null);
          }}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <img
              src={selectedImage}
              alt="Enlarged view"
              className="max-w-full max-h-[90vh] object-contain rounded-3xl border-4 cursor-pointer"
              style={{ borderColor }}
              onClick={() => {
                if (selectedIndex !== null) {
                  fileInputRefs.current[selectedIndex]?.click();
                }
              }}
            />
            <button
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70 transition-all"
              onClick={() => {
                setSelectedImage(null);
                setSelectedIndex(null);
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGrid;