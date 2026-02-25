import { Card, CardContent } from '@/components/ui/card';
import { coreValues } from './data';
import type { PageFeatureItem } from '@/components/website/common/page-components';

async function CoreValuesSection() {
  return (
    <section className="section-padding container">
      <div className="mb-16 text-center">
        <h2 className="mb-4 text-3xl font-bold">Our Core Values</h2>
        <p className="text-muted-foreground mx-auto max-w-3xl text-xl">
          At MAP Media Art Production, we are committed to delivering exceptional visual content that
          inspires, informs, and engages audiences. Our core values guide our work and shape the way we
          approach every project.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {coreValues.map((value, index) => {
          const Icon = (value as PageFeatureItem).icon;
          return (
            <div key={index}>
              <Card className="h-full border shadow-sm transition-shadow duration-200 hover:shadow-md">
                <CardContent className="p-8 text-center">
                  <div className="mb-6">
                    <div className="bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-lg">
                      <Icon className="text-primary h-6 w-6" />
                    </div>
                  </div>
                  <h3 className="mb-4 text-2xl font-bold">{value.title}</h3>
                  <p className="text-muted-foreground text-base leading-relaxed">
                    {value.description ?? value.desc ?? ''}
                  </p>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default CoreValuesSection;
