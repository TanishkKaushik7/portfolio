import type{ BoxAsset, ShoeAsset } from '../types/shoebox';

export const BOX_ASSETS: BoxAsset[] = [
  {
    id: 'box-01',
    label: 'Box 01',
    src: '/BOXES-01.png',
  },
  {
    id: 'box-02',
    label: 'Box 02',
    src: '/BOXES-02.png',
  },
];

export const SHOE_ASSETS: ShoeAsset[] = Array.from({ length: 11 }, (_, index) => {
  const num = String(index + 1).padStart(2, '0');
  return {
    id: `shoe-${num}`,
    title: `Shoe Design ${num}`,
    src: `/ALL SHOES-${num}.png`,
  };
});