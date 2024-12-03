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

export type ThemeNames = 'happy' | 'calm' | 'energetic' | 'dreamy' | 'cozy' | 'peaceful' | 'romantic' | 'melancholic';

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
  dreamy: {
    name: 'Dreamy',
    mood: '🌙',
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
  cozy: {
    name: 'Cozy',
    mood: '🧸',
    pageBackground: '#F9E4D4',
    headerBackground: '#F8CBA6',
    fontColor: '#4A3933',
    emptySquareColor: '#F5D5B5',
    borderColor: '#E7B488',
    gradientColors: {
      from: '#F8CBA6',
      via: '#E7B488',
      to: '#BE8C63'
    }
  },
  peaceful: {
    name: 'Peaceful',
    mood: '🍃',
    pageBackground: '#E8F3D6',
    headerBackground: '#CEEDC7',
    fontColor: '#285430',
    emptySquareColor: '#DCF0D5',
    borderColor: '#9DC08B',
    gradientColors: {
      from: '#CEEDC7',
      via: '#9DC08B',
      to: '#5F8D4E'
    }
  },
  romantic: {
    name: 'Romantic',
    mood: '🌸',
    pageBackground: '#FFE6E6',
    headerBackground: '#FFC4C4',
    fontColor: '#850E35',
    emptySquareColor: '#FFD6D6',
    borderColor: '#FF9494',
    gradientColors: {
      from: '#FFC4C4',
      via: '#FF9494',
      to: '#FF7676'
    }
  },
  melancholic: {
    name: 'Melancholic',
    mood: '🌧️',
    pageBackground: '#E6E6FA',
    headerBackground: '#D4D4F5',
    fontColor: '#353574',
    emptySquareColor: '#DEDEFA',
    borderColor: '#B5B5E9',
    gradientColors: {
      from: '#D4D4F5',
      via: '#B5B5E9',
      to: '#7B7BC4'
    }
  }
};
