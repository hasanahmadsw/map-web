import MotionWrapper from '@/components/shared/motion/motion-wrapper';
import { Card, CardContent } from '@/components/ui/card';

import Image from 'next/image';

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

  return <Icon className="text-primary h-8 w-8 transition-transform duration-300 group-hover:scale-110" />;
};

async function CoreValuesSection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <MotionWrapper
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <MotionWrapper
            as="h2"
            className="mb-4 text-3xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Our Core Values
          </MotionWrapper>
          <MotionWrapper
            as="p"
            className="text-muted-foreground mx-auto max-w-3xl text-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            At MAP Media Art Production, we are committed to delivering exceptional visual content that
            inspires, informs, and engages audiences. Our core values guide our work and shape the way we
            approach every project.
          </MotionWrapper>
        </MotionWrapper>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {coreValues.map((value, index) => (
            <MotionWrapper
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: 'easeOut',
              }}
              viewport={{ once: true, margin: '-50px' }}
            >
              <Card className="group relative transform overflow-hidden border-none bg-gradient-to-br from-white to-blue-50/30 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                {/* Background decorative elements */}
                <div className="absolute top-1/2 left-1/4 h-12 w-12 rounded-full bg-[radial-gradient(circle,_var(--secondary)/30,transparent_70%)] opacity-20" />
                <div className="absolute right-1/4 bottom-4 h-8 w-8 rounded-full bg-[radial-gradient(circle,_var(--secondary)/30,transparent_70%)] opacity-20" />
                <div className="from-primary/10 to-secondary/10 absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <CardContent className="relative p-8 text-center">
                  {/* Icon container with enhanced styling */}
                  <div className="relative mb-8">
                    <div className="from-primary/10 to-primary/20 mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:shadow-xl">
                      <div className="text-primary group-hover:text-primary/80 transition-colors duration-300">
                        {getIcon(value.icon as keyof typeof iconMap)}
                      </div>
                    </div>
                    {/* Floating particles effect */}
                    <div className="bg-primary/30 absolute -top-2 -right-2 h-4 w-4 animate-pulse rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="bg-primary/20 absolute -bottom-1 -left-1 h-3 w-3 animate-pulse rounded-full opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                  </div>

                  {/* Title with enhanced typography */}
                  <h3 className="group-hover:text-primary mb-6 text-2xl font-bold text-gray-900 transition-colors duration-300">
                    {value.title}
                  </h3>

                  {/* Description with improved readability */}
                  <p className="text-base leading-relaxed text-gray-600 transition-colors duration-300 group-hover:text-gray-700">
                    {value.description}
                  </p>

                  {/* Decorative element */}
                  <div className="via-primary/30 absolute bottom-0 left-1/2 h-1 w-16 -translate-x-1/2 transform bg-gradient-to-r from-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </CardContent>
              </Card>
            </MotionWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CoreValuesSection;
