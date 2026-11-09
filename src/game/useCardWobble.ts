import React from 'react';

export function useCardWobble() {
  const getWobbleStyle = (index: number, isSelected: boolean): React.CSSProperties => {
    // Math sine wave floating bob and 5-degree rotation tilt
    // Staggered sine phase across cards via varied durations and offsets
    const duration = 2.6 + (index % 4) * 0.35;
    const delay = -(index * 0.45);

    return {
      animationName: isSelected ? 'card-floating-wobble-selected' : 'card-floating-wobble',
      animationDuration: `${duration.toFixed(2)}s`,
      animationTimingFunction: 'ease-in-out',
      animationDelay: `${delay.toFixed(2)}s`,
      animationIterationCount: 'infinite',
      willChange: 'transform',
    };
  };

  return { getWobbleStyle };
}
