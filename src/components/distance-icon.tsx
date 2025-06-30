import type { SVGProps } from 'react';
import type { DistanceKey } from '@/components/iron-time-predictor';

interface DistanceIconProps extends SVGProps<SVGSVGElement> {
  distance: DistanceKey;
}

export function DistanceIcon({ distance, ...props }: DistanceIconProps) {
  const commonProps = {
    viewBox: '0 0 24 24',
    fill: 'currentColor',
    ...props,
  };

  switch (distance) {
    case 'full':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
    case 'half':
      return (
        <svg {...commonProps}>
          <path d="M12 2 a10 10 0 0 0 0 20Z" />
        </svg>
      );
    case 'olympic': // 25% pie slice
      return (
        <svg {...commonProps}>
          <path d="M12 12 H22 A10 10 0 0 0 12 2Z" />
        </svg>
      );
    case 'sprint': // 12.5% pie slice
      return (
        <svg {...commonProps}>
           <path d="M12 12 V2 A10 10 0 0 1 19.071 4.929Z" />
        </svg>
      );
    default:
      return null;
  }
}
