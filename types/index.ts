export interface ImagePosition {
  x: number;
  y: number;
}

export interface BasePosition {
  scale: number;
  x: number;
  y: number;
}

export interface WindowWithImageSet extends Window {
  hasUserToggledImageSet?: boolean;
  toggleImageSet?: () => void;
}

export interface CSSProperties extends React.CSSProperties {
  [key: string]: any;
}
