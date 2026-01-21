export enum WormColor {
  GREEN = 'green', // Camouflaged
  RED = 'red',     // Conspicuous
  YELLOW = 'yellow' // Conspicuous
}

export interface Worm {
  id: string;
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  color: WormColor;
  isCaught: boolean;
  rotation: number;
  requiredClicks: number; // Number of clicks needed to catch
  clickCount: number;     // Current clicks
}

export interface GameStats {
  totalGreen: number;
  caughtGreen: number;
  totalOthers: number;
  caughtOthers: number;
  roundsPlayed: number;
}

export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  FINISHED = 'FINISHED'
}