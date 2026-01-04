import MotionWrapper from '@/components/shared/motion/motion-wrapper';
import { Card, CardContent } from '@/components/ui/card';

import { Eye, Zap } from 'lucide-react';

export default async function MissionVisionSection() {
  return (
    <section className="section-padding container">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Mission Card */}
        <MotionWrapper
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-50px' }}
        >
          <Card className="h-full border shadow-sm transition-shadow duration-200 hover:shadow-md">
            <CardContent className="flex h-full flex-col p-6">
              <div className="mb-6 flex items-start gap-4">
                <div className="bg-primary/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg">
                  <Zap className="text-primary h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-primary mb-2 text-2xl font-bold">Our Mission</h3>
                  <div className="bg-primary h-1 w-12 rounded-full" />
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-center">
                <p className="text-muted-foreground text-base leading-relaxed">
                  At MAP Media Art Production, we are a creative force shaping the future of media and
                  storytelling in the UAE, Saudi Arabia, and the wider Middle East. With over 25 years of
                  experience, we combine artistic vision, technical expertise, and innovation to bring
                  powerful ideas to life through compelling visual content.
                </p>
              </div>
            </CardContent>
          </Card>
        </MotionWrapper>

        {/* Vision Card */}
        <MotionWrapper
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-50px' }}
        >
          <Card className="h-full border shadow-sm transition-shadow duration-200 hover:shadow-md">
            <CardContent className="flex h-full flex-col p-6">
              <div className="mb-6 flex items-start gap-4">
                <div className="bg-primary/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg">
                  <Eye className="text-primary h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-primary mb-2 text-2xl font-bold">Our Vision</h3>
                  <div className="bg-primary h-1 w-12 rounded-full" />
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-center">
                <p className="text-muted-foreground text-base leading-relaxed">
                  Our vision is to be a leading media and storytelling company in the UAE, Saudi Arabia, and
                  the wider Middle East, known for our creative excellence and innovation. We aim to inspire,
                  inform, and engage audiences through impactful visual content that resonates with cultural
                  identity and global perspectives.
                </p>
              </div>
            </CardContent>
          </Card>
        </MotionWrapper>
      </div>
    </section>
  );
}
