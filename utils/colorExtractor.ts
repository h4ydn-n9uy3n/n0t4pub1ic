export async function extractColors(imageUrl: string): Promise<{
  mainColor: string;
  secondaryColor: string;
  accentColor: string;
}> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      const colorCounts: { [key: string]: number } = {};
      
      // Sample every 4th pixel for performance
      for (let i = 0; i < imageData.length; i += 16) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        
        // Convert to hex and store in map
        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
        colorCounts[hex] = (colorCounts[hex] || 0) + 1;
      }

      // Sort colors by frequency
      const sortedColors = Object.entries(colorCounts)
        .sort(([, a], [, b]) => b - a)
        .map(([color]) => color)
        .slice(0, 3);

      // Ensure we have 3 colors
      while (sortedColors.length < 3) {
        sortedColors.push(sortedColors[0]);
      }

      resolve({
        mainColor: sortedColors[0],
        secondaryColor: sortedColors[1],
        accentColor: sortedColors[2]
      });
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = imageUrl;
  });
}
