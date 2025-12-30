import MotionWrapper from '@/components/shared/motion/motion-wrapper';
import { Card, CardContent } from '@/components/ui/card';

import { Eye, Zap } from 'lucide-react';

export default async function MissionVisionSection() {
  return (
    <section className="section-padding container">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Mission Card */}
        <MotionWrapper
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <Card className="group relative h-full transform overflow-hidden border-none bg-linear-to-br from-white to-blue-50/30 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
            {/* Background decorative elements */}
            <div className="from-primary/15 to-secondary/15 absolute top-0 right-0 h-32 w-32 translate-x-16 -translate-y-16 rounded-full bg-linear-to-br transition-transform duration-700 group-hover:scale-110" />
            <div className="from-primary/15 to-secondary/15 absolute bottom-0 left-0 h-24 w-24 -translate-x-12 translate-y-12 rounded-full bg-linear-to-tr transition-transform duration-700 group-hover:scale-110" />

            {/* Additional background elements for better visibility */}
            <div className="absolute top-1/2 left-1/4 h-24 w-24 rounded-full bg-[radial-gradient(circle,var(--secondary)/30,transparent_70%)] opacity-20" />
            <div className="absolute right-1/4 bottom-8 h-16 w-16 rounded-full bg-[radial-gradient(circle,var(--secondary)/30,transparent_70%)] opacity-20" />

            {/* Gradient overlay */}
            <div className="from-primary/10 to-secondary/10 absolute inset-0 bg-linear-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <CardContent className="relative flex h-full flex-col p-6">
              {/* Header section with icon and title */}
              <div className="mb-6 flex items-start gap-4">
                <div className="relative shrink-0">
                  <div className="from-primary/10 to-secondary/20 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:shadow-xl">
                    <Zap className="text-primary h-8 w-8 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  {/* Floating particles effect */}
                  <div className="bg-primary/40 absolute -end-1 -top-1 h-3 w-3 animate-pulse rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="bg-primary/30 absolute -start-1 -bottom-1 h-2 w-2 animate-pulse rounded-full opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                </div>

                <div className="flex-1">
                  <h3 className="text-primary mb-2 text-2xl font-bold transition-transform duration-300 group-hover:scale-105">
                    Our Mission
                  </h3>
                  <div className="from-primary to-secondary h-1 w-12 rounded-full bg-linear-to-r opacity-60 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
              </div>

              {/* Description with improved readability */}
              <div className="flex flex-1 flex-col justify-center">
                <p className="mb-4 text-base leading-relaxed text-gray-600 transition-colors duration-300 group-hover:text-gray-700">
                  At MAP Media Art Production, we are a creative force shaping the future of media and
                  storytelling in the UAE, Saudi Arabia, and the wider Middle East. With over 25 years of
                  experience, we combine artistic vision, technical expertise, and innovation to bring
                  powerful ideas to life through compelling visual content.
                </p>
              </div>

              {/* Bottom decorative elements */}
              <div className="mt-6 flex items-center justify-between">
                <div className="flex space-x-2">
                  <div className="bg-primary/40 h-2 w-2 animate-pulse rounded-full delay-100 duration-300" />
                  <div className="bg-primary/40 h-2 w-2 animate-pulse rounded-full delay-400 duration-300" />
                  <div className="bg-primary/40 h-2 w-2 animate-pulse rounded-full delay-700 duration-300" />
                </div>
              </div>
            </CardContent>
          </Card>
        </MotionWrapper>

        {/* Vision Card */}
        <MotionWrapper
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            ease: 'easeOut',
          }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <Card className="group relative h-full transform overflow-hidden border-none bg-linear-to-br from-white to-blue-50/30 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
            {/* Background decorative elements */}
            <div className="from-primary/15 to-secondary/15 absolute top-0 right-0 h-32 w-32 translate-x-16 -translate-y-16 rounded-full bg-linear-to-br transition-transform duration-700 group-hover:scale-110" />
            <div className="from-primary/15 to-secondary/15 absolute bottom-0 left-0 h-24 w-24 -translate-x-12 translate-y-12 rounded-full bg-linear-to-tr transition-transform duration-700 group-hover:scale-110" />

            {/* Additional background elements for better visibility */}
            <div className="absolute top-1/2 left-1/4 h-24 w-24 rounded-full bg-[radial-gradient(circle,var(--secondary)/30,transparent_70%)] opacity-20" />
            <div className="absolute right-1/4 bottom-8 h-16 w-16 rounded-full bg-[radial-gradient(circle,var(--secondary)/30,transparent_70%)] opacity-20" />

            {/* Gradient overlay */}
            <div className="from-primary/10 to-secondary/10 absolute inset-0 bg-linear-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <CardContent className="relative flex h-full flex-col p-6">
              {/* Header section with icon and title */}
              <div className="mb-6 flex items-start gap-4">
                <div className="relative shrink-0">
                  <div className="from-primary/10 to-secondary/20 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:shadow-xl">
                    <Eye className="text-primary h-8 w-8 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  {/* Floating particles effect */}
                  <div className="bg-primary/40 absolute -end-1 -top-1 h-3 w-3 animate-pulse rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="bg-primary/30 absolute -start-1 -bottom-1 h-2 w-2 animate-pulse rounded-full opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                </div>

                <div className="flex-1">
                  <h3 className="text-primary mb-2 text-2xl font-bold transition-transform duration-300 group-hover:scale-105">
                    Our Vision
                  </h3>
                  <div className="from-primary to-secondary h-1 w-12 rounded-full bg-linear-to-r opacity-60 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
              </div>

              {/* Description with improved readability */}
              <div className="flex flex-1 flex-col justify-center">
                <p className="mb-4 text-base leading-relaxed text-gray-600 transition-colors duration-300 group-hover:text-gray-700">
                  Our vision is to be a leading media and storytelling company in the UAE, Saudi Arabia, and
                  the wider Middle East, known for our creative excellence and innovation. We aim to inspire,
                  inform, and engage audiences through impactful visual content that resonates with cultural
                  identity and global perspectives.
                </p>
              </div>

              {/* Bottom decorative elements */}
              <div className="mt-6 flex items-center justify-between">
                <div className="flex space-x-2">
                  <div className="bg-primary/40 h-2 w-2 animate-pulse rounded-full delay-100 duration-300" />
                  <div className="bg-primary/40 h-2 w-2 animate-pulse rounded-full delay-400 duration-300" />
                  <div className="bg-primary/40 h-2 w-2 animate-pulse rounded-full delay-700 duration-300" />
                </div>
              </div>
            </CardContent>
          </Card>
        </MotionWrapper>
      </div>
    </section>
  );
}
