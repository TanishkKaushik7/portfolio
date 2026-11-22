export interface BoxAsset {
  id: string;
  label: string;
  src: string;
}

export interface ShoeAsset {
  id: string;
  title: string;
  src: string;
}

export interface ShoeTrajectory {
  x: number;
  peakY: number;
  landY: number;
  rotate: number;
  scale: number;
  jumpDuration: number;
  fallDuration: number;
  vanishDuration: number;
}

export interface CollectedShoeItem {
  key: string;
  shoe: ShoeAsset;
}