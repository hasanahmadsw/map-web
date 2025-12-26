import HeroSection from '@/components/shared/hero-section';
import MotionWrapper from '@/components/shared/motion/motion-wrapper';
import ContactDetails from '@/components/website/contact/contact-details';
import ContactForm from '@/components/website/contact/contact-form';
import { createEnhancedMetadata } from '@/utils/seo/meta/enhanced-meta';

export async function generateMetadata() {
  const metaData = createEnhancedMetadata({
    title: 'Contact MAP Media Art Production | Start Your Project',
    description:
      'Get in touch with MAP Media Art Production to discuss your media project, request a quote, or start a creative collaboration today.',
    pathname: '/contact',
    mainOverrides: {
      category: 'Business Contact',
    },
  });

  return metaData;
}

export default async function ContactPage() {
  // Markup Schema
  // const jsonLd = await contactPageSchema(lang);

  return (
    <>
      {/* JSON-LD */}
      {/* <script
        id="contact-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      /> */}

      <HeroSection imageSrc="/hero.webp" overlayDirection="left-to-right">
        <MotionWrapper
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h1 className="text-primary mb-4 text-center text-5xl font-extrabold drop-shadow-lg md:text-6xl">
            Contact Our Team
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-center text-xl">
            Contact us for any questions or inquiries
          </p>
        </MotionWrapper>
      </HeroSection>

      <main>
        {/* Contact Section with gradient background and cards */}
        <section className="from-primary/10 via-secondary/10 to-accent/10 relative overflow-hidden bg-linear-to-br py-16 lg:py-24">
          <div className="container mx-auto max-w-7xl px-4">
            <MotionWrapper
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              viewport={{ once: true }}
              className="grid grid-cols-1 items-stretch gap-12 lg:grid-cols-2"
            >
              {/* Contact Details Card */}
              <div className="group from-secondary/30 via-muted/40 to-primary/20 border-border relative flex transform flex-col justify-center rounded-2xl border bg-linear-to-br p-8 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                <div className="from-primary/10 to-secondary/10 absolute top-0 right-0 h-24 w-24 translate-x-10 -translate-y-10 rounded-full bg-linear-to-br transition-transform duration-700 group-hover:scale-110" />
                <div className="from-accent/10 to-muted/10 absolute bottom-0 left-0 h-16 w-16 -translate-x-8 translate-y-8 rounded-full bg-linear-to-tr transition-transform duration-700 group-hover:scale-110" />
                <ContactDetails />
              </div>

              {/* Contact Form Card */}
              <div className="group from-primary/30 via-muted/40 to-secondary/20 border-border relative flex transform flex-col justify-center rounded-2xl border bg-linear-to-br p-8 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                <div className="from-secondary/10 to-primary/10 absolute top-0 left-0 h-20 w-20 -translate-x-8 -translate-y-8 rounded-full bg-linear-to-br transition-transform duration-700 group-hover:scale-110" />
                <div className="from-accent/10 to-muted/10 absolute right-0 bottom-0 h-16 w-16 translate-x-8 translate-y-8 rounded-full bg-linear-to-tr transition-transform duration-700 group-hover:scale-110" />
                <ContactForm />
              </div>
            </MotionWrapper>
          </div>
        </section>
      </main>
    </>
  );
}
