import { m } from 'framer-motion';
import { memo, useMemo } from 'react';

type SparkVariant = 'classic' | 'motion';

type SparkProps = {
  variant?: SparkVariant;
  message?: string;
  starCount?: number;
};

type StarSeed = {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
};

const SPARK_COLORS = ['#8B5CF6', '#EC4899', '#3B82F6', '#06B6D4', '#A855F7'];

function ClassicSparkStars({ message, starCount = 80 }: Required<SparkProps>) {
  const stars = useMemo<StarSeed[]>(
    () =>
      Array.from({ length: starCount }, (_, id) => ({
        id,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 2,
        color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)]
      })),
    [starCount]
  );

  return (
    <div className="spark-stars spark-stars--classic">
      <div className="spark-stars__central">
        <svg width="96" height="96" viewBox="0 0 80 80" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="sparkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="50%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
          <path
            d="M40 10 L45 30 L60 35 L45 40 L40 60 L35 40 L20 35 L35 30 Z"
            fill="url(#sparkGradient)"
            className="spark-stars__central-path"
          />
        </svg>
      </div>
      {message ? <p className="spark-stars__message">{message}</p> : null}
      {stars.map(star => (
        <span
          key={star.id}
          className="spark-stars__particle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.color,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`
          }}
        />
      ))}
    </div>
  );
}

const ClassicMemo = memo(ClassicSparkStars);

function MotionSparkStars({ message, starCount = 96 }: Required<SparkProps>) {
  return (
    <div className="spark-stars spark-stars--motion">
      <m.div
        initial={{ scale: 0.85, rotate: 0 }}
        animate={{
          scale: [1, 1.08, 1],
          rotate: 360
        }}
        transition={{
          scale: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: 24, repeat: Infinity, ease: 'linear' }
        }}
        className="spark-stars__central spark-stars__central--motion"
      >
        <svg width="96" height="96" viewBox="0 0 80 80" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="sparkGradMotion" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="50%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
            <filter id="sparkGlow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path d="M40 10 L45 30 L60 35 L45 40 L40 60 L35 40 L20 35 L35 30 Z" fill="url(#sparkGradMotion)" filter="url(#sparkGlow)" />
        </svg>
      </m.div>
      {message ? (
        <m.p
          className="spark-stars__message spark-stars__message--motion"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        >
          {message}
        </m.p>
      ) : null}
      {Array.from({ length: starCount }).map((_, index) => {
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const size = Math.random() * 4 + 1;
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 2;
        const color = SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)];

        return (
          <m.span
            key={index}
            className="spark-stars__particle spark-stars__particle--motion"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: color,
              boxShadow: `0 0 ${size * 3}px ${color}`
            }}
            initial={{ opacity: 0, scale: 0, rotate: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], rotate: [0, 180, 360] }}
            transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        );
      })}
    </div>
  );
}

const MotionMemo = memo(MotionSparkStars);

export function SparkStars({ variant = 'classic', message = 'Translating human to computer.', starCount }: SparkProps) {
  if (variant === 'motion') {
    return <MotionMemo variant="motion" message={message} starCount={starCount ?? 70} />;
  }
  return <ClassicMemo variant="classic" message={message} starCount={starCount ?? 48} />;
}
