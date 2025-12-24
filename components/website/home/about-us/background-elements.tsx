import MotionWrapper from '@/components/shared/motion/motion-wrapper';

export default function BackgroundElements() {
  return (
    <div className="absolute inset-0 z-0">
      {/* Gradient Background */}
      <div className="to-primary/5 from-muted via-background absolute inset-0 bg-linear-to-br" />

      {/* Animated Orbs */}
      <MotionWrapper
        className="absolute top-10 left-10 h-80 w-80 rounded-full opacity-20"
        style={{ background: 'linear-gradient(45deg, var(--primary), var(--primary))' }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 20, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <MotionWrapper
        className="absolute right-10 bottom-10 h-96 w-96 rounded-full opacity-20"
        style={{ background: 'linear-gradient(45deg, var(--primary), var(--primary))' }}
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -30, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
