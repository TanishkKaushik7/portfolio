import { useState } from 'react';
import { BOX_ASSETS, SHOE_ASSETS } from './data/shoeboxAssets';
import ShoeboxStage from './components/shoebox/ShoeboxStage';
import ShoePreviewModal from './components/shoebox/ShoePreviewModal';
import type{ ShoeAsset } from './types/shoebox';

export default function App() {
  const [selectedBoxIndex, setSelectedBoxIndex] = useState<number>(0);
  const [previewShoe, setPreviewShoe] = useState<ShoeAsset | null>(null);

  const currentBox = BOX_ASSETS[selectedBoxIndex];

  const handleBoxOpen = () => {
    if (BOX_ASSETS.length > 1) {
      setSelectedBoxIndex(1);
    }
  };

  const handleBoxClose = () => {
    setSelectedBoxIndex(0);
  };

  const handleSelectShoe = (shoe: ShoeAsset) => {
    setPreviewShoe(shoe);
  };

  const handleClosePreview = () => {
    setPreviewShoe(null);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-stone-100 p-6 text-stone-900">
      <ShoeboxStage
        box={currentBox}
        shoes={SHOE_ASSETS}
        onBoxOpen={handleBoxOpen}
        onBoxClose={handleBoxClose}
        onSelectShoe={handleSelectShoe}
      />

      <ShoePreviewModal
        shoe={previewShoe}
        onClose={handleClosePreview}
      />
    </main>
  );
}