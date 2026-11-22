import { useEffect, useState } from 'react';
import type{ ShoeAsset, ShoeTrajectory } from '../../types/shoebox';

interface PoppingShoeProps {
  shoe: ShoeAsset;
  trajectory: ShoeTrajectory;
  onVanish?: () => void;
  onSelectShoe?: (shoe: ShoeAsset) => void;
}

type Phase = 'spawn' | 'peak' | 'landed' | 'vanishing';

export default function PoppingShoe({
  shoe,
  trajectory,
  onVanish,
  onSelectShoe,
}: PoppingShoeProps) {
  const [phase, setPhase] = useState<Phase>('spawn');

  useEffect(() => {
    let fallTimer: ReturnType<typeof setTimeout>;
    let vanishTimer: ReturnType<typeof setTimeout>;
    let doneTimer: ReturnType<typeof setTimeout>;

    const peakFrame = requestAnimationFrame(() => {
      setPhase('peak');

      // 1. Drop downward and straighten out
      fallTimer = setTimeout(() => {
        setPhase('landed');

        // 2. Begin vanishing after landing straight
        vanishTimer = setTimeout(() => {
          setPhase('vanishing');

          // 3. Notify parent once vanished so it joins the row below
          doneTimer = setTimeout(() => {
            onVanish?.();
          }, trajectory.vanishDuration);
        }, 120);
      }, trajectory.jumpDuration);
    });

    return () => {
      cancelAnimationFrame(peakFrame);
      clearTimeout(fallTimer);
      clearTimeout(vanishTimer);
      clearTimeout(doneTimer);
    };
  }, [trajectory, onVanish]);

  const halfX = Math.round(trajectory.x * 0.55);

  let transformValue = 'translate3d(0px, 0px, 0) rotate(0deg) scale(0.65)';
  let opacityValue = 0;
  let transitionValue = 'none';

  if (phase === 'peak') {
    transformValue = `translate3d(${halfX}px, ${trajectory.peakY}px, 0) rotate(${trajectory.rotate}deg) scale(${trajectory.scale})`;
    opacityValue = 1;
    transitionValue = `transform ${trajectory.jumpDuration}ms cubic-bezier(0.22, 1, 0.36, 1), opacity 160ms ease-out`;
  } else if (phase === 'landed') {
    transformValue = `translate3d(${trajectory.x}px, ${trajectory.landY}px, 0) rotate(0deg) scale(1)`;
    opacityValue = 1;
    transitionValue = `transform ${trajectory.fallDuration}ms cubic-bezier(0.55, 0.06, 0.68, 0.53)`;
  } else if (phase === 'vanishing') {
    transformValue = `translate3d(${trajectory.x}px, ${trajectory.landY + 12}px, 0) rotate(0deg) scale(0.92)`;
    opacityValue = 0;
    transitionValue = `transform ${trajectory.vanishDuration}ms ease-in, opacity ${trajectory.vanishDuration}ms ease-in`;
  }

  return (
    <button
      type="button"
      onClick={() => onSelectShoe?.(shoe)}
      style={{
        transform: transformValue,
        opacity: opacityValue,
        transition: transitionValue,
      }}
      className="pointer-events-auto absolute bottom-20 left-1/2 z-10 -translate-x-1/2 cursor-pointer focus:outline-none"
    >
      <img
        src={shoe.src}
        alt={shoe.title}
        draggable={false}
        className="h-32 w-auto object-contain drop-shadow-md sm:h-40 md:h-44"
      />
    </button>
  );
}