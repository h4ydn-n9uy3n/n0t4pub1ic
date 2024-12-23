interface ColorTheme {
  name: string;
  mood: string;
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
}

interface ThemeSet {
  [key: string]: ColorTheme;
}

export const themes: ThemeSet = {
  happy: {
    name: 'Happy',
    mood: '😊',
    pageBackground: '#FFCFD2',
    headerBackground: '#FFAFC5',
    fontColor: '#553E4E',
    emptySquareColor: '#FFB5C2',
    borderColor: '#FF8FAB',
    gradientColors: {
      from: '#FFB7B2',
      via: '#FF8FAB',
      to: '#E0479E'
    }
  },
  calm: {
    name: 'Calm',
    mood: '😌',
    pageBackground: '#E3F6F5',
    headerBackground: '#BAE8E8',
    fontColor: '#272343',
    emptySquareColor: '#C4E3E3',
    borderColor: '#98C1D9',
    gradientColors: {
      from: '#BAE8E8',
      via: '#98C1D9',
      to: '#2D334A'
    }
  },
  energetic: {
    name: 'Energetic',
    mood: '⚡',
    pageBackground: '#FFF3B0',
    headerBackground: '#FFE169',
    fontColor: '#6B4423',
    emptySquareColor: '#FFE9A3',
    borderColor: '#FFD93D',
    gradientColors: {
      from: '#FFE169',
      via: '#FFD93D',
      to: '#FF9843'
    }
  },
  romantic: {
    name: 'Romantic',
    mood: '🌹',
    pageBackground: '#F3E8FF',
    headerBackground: '#E5B8F4',
    fontColor: '#2D033B',
    emptySquareColor: '#E7C6FF',
    borderColor: '#C147E9',
    gradientColors: {
      from: '#E5B8F4',
      via: '#C147E9',
      to: '#810CA8'
    }
  },
  dreamy: {
    name: 'Dreamy',
    mood: '🌙',
    pageBackground: '#E0F4FF',
    headerBackground: '#B9E9FC',
    fontColor: '#1B262C',
    emptySquareColor: '#C9EEFF',
    borderColor: '#87CBF5',
    gradientColors: {
      from: '#B9E9FC',
      via: '#87CBF5',
      to: '#5DA7DB'
    }
  },
  cozy: {
    name: 'Cozy',
    mood: '🧸',
    pageBackground: '#FFF8EA',
    headerBackground: '#F8E8D4',
    fontColor: '#402E32',
    emptySquareColor: '#FFE3C1',
    borderColor: '#E1C78F',
    gradientColors: {
      from: '#F8E8D4',
      via: '#E1C78F',
      to: '#A27B5C'
    }
  },
  peaceful: {
    name: 'Peaceful',
    mood: '🕊️',
    pageBackground: '#F0F9F9',
    headerBackground: '#D7E9E9',
    fontColor: '#2C3333',
    emptySquareColor: '#E0F2F2',
    borderColor: '#A5C9C9',
    gradientColors: {
      from: '#D7E9E9',
      via: '#A5C9C9',
      to: '#395B64'
    }
  },
  loved: {
    name: 'Loved',
    mood: '💝',
    pageBackground: '#FFE6E6',
    headerBackground: '#FFB6B6',
    fontColor: '#8B0000',
    emptySquareColor: '#FFCECE',
    borderColor: '#FF6B6B',
    gradientColors: {
      from: '#FFB6B6',
      via: '#FF6B6B',
      to: '#E85555'
    }
  },
  blessed: {
    name: 'Blessed',
    mood: '✨',
    pageBackground: '#E8FFF8',
    headerBackground: '#B6FFE6',
    fontColor: '#006D5B',
    emptySquareColor: '#CEFFF0',
    borderColor: '#4ECDC4',
    gradientColors: {
      from: '#B6FFE6',
      via: '#4ECDC4',
      to: '#38B7AE'
    }
  }
};

export type ThemeNames = 'happy' | 'calm' | 'energetic' | 'romantic' | 'dreamy' | 'cozy' | 'peaceful' | 'custom' | 'loved' | 'blessed';
