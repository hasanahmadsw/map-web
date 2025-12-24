'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import React from 'react';

type ElementType =
  | 'div'
  | 'span'
  | 'p'
  | 'section'
  | 'article'
  | 'main'
  | 'header'
  | 'footer'
  | 'nav'
  | 'aside'
  | 'a'
  | 'li'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6';

type MotionWrapperProps<T extends ElementType> = Omit<HTMLMotionProps<T>, 'as'> & {
  children?: React.ReactNode;
  className?: string;
  as?: T;
  // Additional simplified props
  fadeUp?: boolean;
  scaleIn?: boolean;
  stagger?: number;
  delay?: number;
};

// Create motion component with proper typing
const createMotionComponent = <T extends ElementType>(as: T) => {
  return motion[as] as React.ComponentType<HTMLMotionProps<T>>;
};

function MotionWrapper<T extends ElementType = 'div'>({
  children,
  className,
  as = 'div' as T,
  fadeUp = false,
  scaleIn = false,
  stagger = 0,
  delay = 0,
  ...props
}: MotionWrapperProps<T>) {
  const MotionComponent = createMotionComponent(as);

  // Simplified variants based on props
  const getVariants = () => {
    if (fadeUp) {
      return {
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            delay: stagger + delay,
            ease: 'easeOut',
          },
        },
      };
    }

    if (scaleIn) {
      return {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: {
            duration: 0.5,
            delay: stagger + delay,
            ease: 'easeOut',
          },
        },
      };
    }

    return props.variants;
  };

  const variants = getVariants();

  return (
    <MotionComponent className={className} variants={variants} {...props}>
      {children}
    </MotionComponent>
  );
}

export default MotionWrapper;
