import ContactDetails from '@/components/website/contact/contact-details';
import { createEnhancedMetadata } from '@/utils/seo/meta/enhanced-meta';
import { generateContactPageSchema } from '@/utils/seo/schema/contact/contact-schema';
import { PageHero, PageSection } from '@/components/website/common/page-components';

export async function generateMetadata() {
  return createEnhancedMetadata({
    title: 'Contact MAP Media Art Production | Start Your Project',
    description:
      'Get in touch with MAP Media Art Production to discuss your media project, request a quote, or start a creative collaboration today.',
    pathname: '/contact',
    mainOverrides: {
      category: 'Business Contact',
    },
  });
}

export default async function ContactPage() {
  const jsonLd = await generateContactPageSchema();

  return (
    <div className="bg-background min-h-screen">
      <script
        id="contact-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />

      <PageHero
        title="Contact Us"
        description="Get in touch with MAP to discuss your media project, request a quote, or start a creative collaboration. We're here to help across Dubai, UAE, and the Gulf."
        buttons={[
          { text: 'Request Quote', href: '/contact?subject=rfq' },
          { text: 'View Services', href: '/services', variant: 'outline' },
        ]}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Contact' },
        ]}
        minHeight="55vh"
      />

      <PageSection>
        <ContactDetails />
      </PageSection>
    </div>
  );
}
