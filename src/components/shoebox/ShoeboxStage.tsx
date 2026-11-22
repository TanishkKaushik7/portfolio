import { useCallback, useEffect, useRef, useState } from 'react';
import type { BoxAsset, CollectedShoeItem, ShoeAsset, ShoeTrajectory } from '../../types/shoebox';
import BoxVisual from './BoxVisual';
import PoppingShoe from './PoppingShoe';

interface ActiveShoeItem {
  instanceId: string;
  shoe: ShoeAsset;
  trajectory: ShoeTrajectory;
  totalDurationMs: number;
}

interface ShoeboxStageProps {
  box: BoxAsset;
  shoes: ShoeAsset[];
  wobbleDurationMs?: number;
  burstDurationMs?: number;
  onBoxOpen?: () => void;
  onBoxClose?: () => void;
  onSelectShoe?: (shoe: ShoeAsset) => void;
}

function shuffleShoes(items: ShoeAsset[]): ShoeAsset[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function createTrajectory(): {
  trajectory: ShoeTrajectory;
  totalDurationMs: number;
} {
  const spreadDirection = Math.random() < 0.5 ? -1 : 1;
  const horizontalDistance = 160 + Math.random() * 105;
  const jumpDuration = Math.round(340 + Math.random() * 110);
  const fallDuration = Math.round(400 + Math.random() * 120);
  const landPauseMs = 90;
  const vanishDuration = 240;

  return {
    trajectory: {
      x: Math.round(spreadDirection * horizontalDistance),
      peakY: Math.round(-215 - Math.random() * 95),
      landY: Math.round(24 + Math.random() * 24),
      rotate: Math.round(spreadDirection * (20 + Math.random() * 24)),
      scale: Number((0.98 + Math.random() * 0.12).toFixed(2)),
      jumpDuration,
      fallDuration,
      vanishDuration,
    },
    totalDurationMs: jumpDuration + fallDuration + landPauseMs + vanishDuration,
  };
}

export default function ShoeboxStage({
  box,
  shoes,
  wobbleDurationMs = 700,
  burstDurationMs = 5000,
  onBoxOpen,
  onBoxClose,
  onSelectShoe,
}: ShoeboxStageProps) {
  const [isWobbling, setIsWobbling] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [activeShoes, setActiveShoes] = useState<ActiveShoeItem[]>([]);
  const [collectedShoes, setCollectedShoes] = useState<CollectedShoeItem[]>([]);

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const deckRef = useRef<ShoeAsset[]>([]);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((id) => clearTimeout(id));
    timersRef.current = [];
  }, []);

  useEffect(() => {
    return () => clearAllTimers();
  }, [clearAllTimers]);

  const handleShoeVanished = useCallback((instanceId: string, shoe: ShoeAsset) => {
    setActiveShoes((prev) => prev.filter((item) => item.instanceId !== instanceId));
    setCollectedShoes((prev) => [
      ...prev,
      {
        key: `${instanceId}-row`,
        shoe,
      },
    ]);
  }, []);

  const spawnNextUniqueShoe = useCallback(() => {
    const chosenShoe = deckRef.current.shift();
    if (!chosenShoe) return;

    const instanceId = `${chosenShoe.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const { trajectory, totalDurationMs } = createTrajectory();

    setActiveShoes((prev) => [
      ...prev,
      { instanceId, shoe: chosenShoe, trajectory, totalDurationMs },
    ]);

    const vanishDoneTimer = setTimeout(() => {
      handleShoeVanished(instanceId, chosenShoe);
    }, totalDurationMs + 30);

    timersRef.current.push(vanishDoneTimer);
  }, [handleShoeVanished]);

  const handleBoxClick = () => {
    if (isRunning || !shoes.length) return;

    clearAllTimers();
    setCollectedShoes([]);
    setActiveShoes([]);
    setIsRunning(true);
    setIsWobbling(true);

    // Prepare a shuffled queue of all shoes so every single shoe appears once
    deckRef.current = shuffleShoes(shoes);

    onBoxOpen?.();

    const startBurstTimer = setTimeout(() => {
      const count = deckRef.current.length;
      // Fit all unique shoes across burstDurationMs with a slight random jitter
      const baseStep = count > 1 ? Math.max(180, Math.floor((burstDurationMs - 300) / count)) : 0;

      for (let i = 0; i < count; i++) {
        const jitter = i === 0 ? 0 : Math.round((Math.random() - 0.5) * 90);
        const delay = Math.max(0, i * baseStep + jitter);

        const spawnTimer = setTimeout(() => {
          spawnNextUniqueShoe();
        }, delay);

        timersRef.current.push(spawnTimer);
      }

      const stopBurstTimer = setTimeout(() => {
        setIsWobbling(false);
        setIsRunning(false);
        onBoxClose?.();
      }, burstDurationMs);

      timersRef.current.push(stopBurstTimer);
    }, wobbleDurationMs);

    timersRef.current.push(startBurstTimer);
  };

  return (
    <div className="flex w-full max-w-5xl flex-col items-center gap-8">
      {/* Pop-Out & Box Stage */}
      <div className="relative flex min-h-[28rem] w-full flex-col items-center justify-end pb-4">
        <div className="pointer-events-none absolute inset-0 overflow-visible">
          {activeShoes.map((item) => (
            <PoppingShoe
              key={item.instanceId}
              shoe={item.shoe}
              trajectory={item.trajectory}
              onSelectShoe={onSelectShoe}
            />
          ))}
        </div>

        <BoxVisual
          boxSrc={box.src}
          alt={box.label}
          isWobbling={isWobbling}
          onClick={handleBoxClick}
        />
      </div>

      {/* Collected Display Row Underneath */}
      {collectedShoes.length > 0 && (
        <div className="flex w-full flex-wrap items-center justify-center gap-4 border-t border-stone-300 pt-6">
          {collectedShoes.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={(e) => {
                e.currentTarget.blur();
                onSelectShoe?.(item.shoe);
              }}
              className="cursor-pointer rounded-xl p-2 caret-transparent select-none transition-transform duration-200 hover:-translate-y-1 hover:scale-105 focus:outline-none"
            >
              <img
                src={item.shoe.src}
                alt={item.shoe.title}
                draggable={false}
                className="h-24 w-auto object-contain select-none drop-shadow-sm sm:h-28 md:h-32"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}