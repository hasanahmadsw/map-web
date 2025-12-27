import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';
import MotionWrapper from '@/components/shared/motion/motion-wrapper';

interface SimpleCTAProps {
  title: string;
  description: string;
  buttonText: string;
  buttonIcon?: React.ElementType;
  className?: string;
  href?: string;
}

export default function CATSection({
  title,
  description,
  buttonText,
  buttonIcon: ButtonIcon = Sparkles,
  className = '',
  href,
}: SimpleCTAProps) {
  return (
    <MotionWrapper
      className={`from-primary/5 to-secondary/5 border-primary/10 rounded-3xl border bg-linear-to-r p-8 text-center shadow-sm ${className}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 1 }}
    >
      <MotionWrapper
        as="h3"
        className="text-foreground mb-4 text-2xl font-semibold md:text-3xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 1.1 }}
      >
        {title}
      </MotionWrapper>

      <MotionWrapper
        as="p"
        className="text-muted-foreground mx-auto mb-8 max-w-md"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        {description}
      </MotionWrapper>

      <MotionWrapper className="group inline-block" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          size="default"
          className="bg-primary hover:shadow-3xl group text-primary-foreground relative overflow-hidden px-8 py-6 text-sm font-medium shadow-2xl transition-all duration-300"
          asChild
        >
          <Link href={href || '#'} role="button" prefetch={false}>
            <ButtonIcon className="mr-2 h-5 w-5 transition-transform duration-500 group-hover:rotate-180" />
            <span className="relative z-10">{buttonText}</span>

            {/* Shine effect */}
            <span className="bg-primary-foreground/20 absolute inset-0 -translate-x-8 rotate-12 transform opacity-0 transition-all duration-500 group-hover:opacity-100" />

            {/* Pulse effect */}
            <MotionWrapper
              className="border-primary-foreground/30 absolute inset-0 border-2"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </Link>
        </Button>
      </MotionWrapper>
    </MotionWrapper>
  );
}
