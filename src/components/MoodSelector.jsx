import React from 'react';

const moods = [
  { name: 'Happy', value: '--mood-happy', color: '#FFD700' },
  { name: 'Peaceful', value: '--mood-peaceful', color: '#98FB98' },
  { name: 'Romantic', value: '--mood-romantic', color: '#FF69B4' },
  { name: 'Sad', value: '--mood-sad', color: '#4169E1' },
  { name: 'Energetic', value: '--mood-energetic', color: '#FF4500' },
  { name: 'Dark', value: '--mood-dark', color: '#800080' },
  { name: 'Chill', value: '--mood-chill', color: '#40E0D0' },
  { name: 'Epic', value: '--mood-epic', color: '#DC143C' },
  { name: 'Dreamy', value: '--mood-dreamy', color: '#DDA0DD' },
];

const MoodSelector = () => {
  const setMoodColor = (color) => {
    document.documentElement.style.setProperty('--mood-color', color);
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center items-center p-4">
      {moods.map((mood) => (
        <button
          key={mood.name}
          onClick={() => setMoodColor(mood.color)}
          className="px-4 py-2 rounded-full text-white transition-all duration-300 hover:scale-110"
          style={{ 
            backgroundColor: mood.color,
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
          }}
        >
          {mood.name}
        </button>
      ))}
    </div>
  );
};

export default MoodSelector;
