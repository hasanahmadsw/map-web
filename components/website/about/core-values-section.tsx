import MotionWrapper from '@/components/shared/motion/motion-wrapper';
import { Card, CardContent } from '@/components/ui/card';

import { Lightbulb, Star, Users, Shield, Heart, Zap } from 'lucide-react';
import { coreValues } from './data';

const iconMap = {
  lightbulb: Lightbulb,
  star: Star,
  users: Users,
  shield: Shield,
  heart: Heart,
  zap: Zap,
};

export const getIcon = (icon: keyof typeof iconMap) => {
  const Icon = iconMap[icon] ?? Zap;

  return <Icon className="text-primary h-6 w-6" />;
};

async function CoreValuesSection() {
  return (
    <section className="section-padding container">
      <MotionWrapper
        className="mb-16 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        viewport={{ once: true, margin: '-50px' }}
      >
        <h2 className="mb-4 text-3xl font-bold">Our Core Values</h2>
        <p className="text-muted-foreground mx-auto max-w-3xl text-xl">
          At MAP Media Art Production, we are committed to delivering exceptional visual content that
          inspires, informs, and engages audiences. Our core values guide our work and shape the way we
          approach every project.
        </p>
      </MotionWrapper>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {coreValues.map((value, index) => (
          <MotionWrapper
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.05,
              ease: 'easeOut',
            }}
            viewport={{ once: true, margin: '-50px' }}
          >
            <Card className="h-full border shadow-sm transition-shadow duration-200 hover:shadow-md">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <div className="bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-lg">
                    {getIcon(value.icon as keyof typeof iconMap)}
                  </div>
                </div>

                <h3 className="mb-4 text-2xl font-bold">{value.title}</h3>

                <p className="text-muted-foreground text-base leading-relaxed">{value.description}</p>
              </CardContent>
            </Card>
          </MotionWrapper>
        ))}
      </div>
    </section>
  );
}

export default CoreValuesSection;
