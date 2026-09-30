import { useId } from 'react';

export const africaPath =
  'M 141.6 103.8 L 168.5 109.3 L 210.3 96.7 L 245.8 95.1 L 263.2 93.5 L 271.9 121.1 L 266.3 135.4 L 284.5 128.2 L 305.8 133 L 327.9 133.8 L 343.7 130.6 L 367.4 133.8 L 384.7 138.5 L 408.4 141.7 L 428.9 140.1 L 443.1 140.9 L 455.7 141.7 L 458.9 166.9 L 466 202.4 L 479.4 218.2 L 490.5 244.3 L 503.1 265.6 L 522 288.5 L 534.7 297.1 L 564.6 297.9 L 590.7 294.8 L 588.3 307.4 L 574.1 323.2 L 552.8 340.5 L 534.7 372.1 L 522 391 L 514.1 403.7 L 504.7 419.5 L 498.4 436.8 L 496.8 452.6 L 505.5 470.8 L 506.2 494.4 L 489.7 510.2 L 466.8 523.6 L 463.6 539.4 L 454.2 565.5 L 445.5 591.5 L 424.2 620.7 L 402.9 646.7 L 387.9 655.4 L 361 657.8 L 343.7 662.5 L 331.8 659.4 L 330.3 642 L 321.6 618.3 L 316.1 613.6 L 305.8 597 L 299.5 565.5 L 291.6 523.6 L 282.9 498.4 L 280.5 455 L 279 431.3 L 266.3 403.7 L 259.2 383.9 L 254.5 369.7 L 261.6 356.3 L 255.3 353.2 L 241.1 353.2 L 230 350 L 225.3 345.3 L 215.8 338.2 L 206.4 339 L 198.5 339.8 L 187.4 343.7 L 168.5 350 L 151.1 346.9 L 133.8 351.6 L 121.1 350 L 111.7 337.4 L 95.9 334.2 L 81.7 320 L 70.6 310.6 L 61.1 294.8 L 53.3 280.6 L 50.9 271.9 L 54.8 260 L 58 241.9 L 56.4 223.7 L 58.8 210.3 L 73.8 189 L 97.4 165.3 L 110.1 148 L 118 138.5 L 136.9 118 L 139.3 105.4 Z';

export const madagascarPath =
  'M 574.9 482.6 L 582 492.1 L 584.4 512.6 L 578.9 533.9 L 564.6 561.5 L 559.9 585.2 L 542.6 589.9 L 530.7 585.2 L 528.3 565.5 L 527.6 541.8 L 529.9 518.1 L 534.7 502.3 L 556.8 492.1 L 572.5 484.2 Z';

export function AfricaShape({
  className = '',
  fill = 'currentColor',
}: {
  className?: string;
  fill?: string;
}) {
  return (
    <svg viewBox="0 0 640 760" className={className} aria-hidden="true">
      <path d={africaPath} fill={fill} />
      <path d={madagascarPath} fill={fill} />
    </svg>
  );
}

export function AfricaPhoto({ src, alt }: { src: string; alt: string }) {
  const clipId = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 640 760" className="block h-auto w-full min-w-0 max-w-full" role="img" aria-label={alt}>
      <defs>
        <clipPath id={clipId}>
          <path d={africaPath} />
          <path d={madagascarPath} />
        </clipPath>
      </defs>
      <image
        href={src}
        x="0"
        y="0"
        width="640"
        height="760"
        preserveAspectRatio="xMidYMid slice"
        clipPath={`url(#${clipId})`}
      />
    </svg>
  );
}

export function AfricaFilledMap({ className = '' }: { className?: string }) {
  const gradientId = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 640 760" className={`block h-auto min-w-0 max-w-full ${className}`} role="img" aria-label="Map of Africa">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor="#1d664d" />
          <stop offset="42%" stopColor="#7cbc8a" />
          <stop offset="100%" stopColor="#f2b857" />
        </linearGradient>
      </defs>
      <path d={africaPath} fill={`url(#${gradientId})`} />
      <path d={madagascarPath} fill="#f2b857" />
    </svg>
  );
}
