import Image from 'next/image';

import MotionWrapper from '@/components/shared/motion/motion-wrapper';

export default async function AboutSection() {
  return (
    <section className="section-padding container">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
          <MotionWrapper
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            viewport={{ once: true, margin: '-100px' }}
          >
            <h2 className="mb-4 text-2xl font-bold">Empowering Stories Across the Middle East</h2>
            <p className="text-muted-foreground">
              At MAP Media Art Production, we are a creative force shaping the future of media and
              storytelling across the UAE, Saudi Arabia, and the wider Middle East. Our mission is to
              transform ideas into powerful visual experiences through innovative media production, strategic
              creativity, and technical excellence.
            </p>

            <h2 className="mt-6 mb-4 text-2xl font-bold">Who We Are</h2>
            <p className="text-muted-foreground">
              Founded with a vision to transform the Qatari business landscape, we are a team of creative
              professionals, strategists, and innovators committed to delivering solutions that make a
              difference. Over the years, we’ve helped countless businesses grow, streamline operations, and
              connect with their audiences effectively.
            </p>
          </MotionWrapper>
          <MotionWrapper
            className="relative h-80 overflow-hidden rounded-lg lg:h-96"
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            viewport={{ once: true, margin: '-100px' }}
          >
            <Image src="/about-image.jpg" alt="About Us" fill className="object-cover" />
          </MotionWrapper>
        </div>
      </div>
    </section>
  );
}
