import type { Metadata } from 'next';
import { createEnhancedMetadata } from '@/utils/seo/meta/enhanced-meta';
import { PageHero, PageSection } from '@/components/website/common/page-components';

export async function generateMetadata(): Promise<Metadata> {
  return createEnhancedMetadata({
    title: 'Terms of Service | MAP Media Art Production',
    description:
      'Terms of service for MAP Media Art Production. Read our terms and conditions for using our website and services.',
    pathname: '/terms',
    mainOverrides: {
      category: 'Legal',
    },
  });
}

export default function TermsPage() {
  return (
    <div className="bg-background min-h-screen max-w-3xl mx-auto">
      <PageHero
        title="Terms of Service"
        description="Please read these terms carefully before using our website or engaging our services."
        buttons={[{ text: 'Contact Us', href: '/contact' }]}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Terms of Service' },
        ]}
        minHeight="40vh"
      />

      <PageSection>
        <div className="prose prose-neutral dark:prose-invert ">
          <p className="text-muted-foreground text-sm">Last updated: {new Date().toLocaleDateString('en-GB')}</p>

          <section className="mt-8 space-y-6">
            <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using the MAP Media Art Production website and services, you agree to be bound by
              these Terms of Service. If you do not agree with any part of these terms, please do not use our
              website or services.
            </p>
          </section>

          <section className="mt-8 space-y-6">
            <h2 className="text-xl font-semibold">2. Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              MAP provides video production, broadcasting, equipment rental, and related media services in Dubai, UAE,
              and the Gulf region. Service terms, deliverables, and fees are agreed upon in separate project
              contracts or quotation documents.
            </p>
          </section>

          <section className="mt-8 space-y-6">
            <h2 className="text-xl font-semibold">3. Use of Website</h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree to use our website for lawful purposes only. You may not use the site to transmit harmful
              content, attempt to gain unauthorised access to our systems, or interfere with the proper functioning
              of the website.
            </p>
          </section>

          <section className="mt-8 space-y-6">
            <h2 className="text-xl font-semibold">4. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              All content on this website, including text, images, logos, and design, is the property of MAP Media Art
              Production or its licensors and is protected by copyright laws. You may not reproduce, distribute, or
              use our content without prior written permission.
            </p>
          </section>

          <section className="mt-8 space-y-6">
            <h2 className="text-xl font-semibold">5. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              MAP shall not be liable for any indirect, incidental, or consequential damages arising from your use of
              our website or services. Our liability is limited to the extent permitted by applicable law.
            </p>
          </section>

          <section className="mt-8 space-y-6">
            <h2 className="text-xl font-semibold">6. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              For questions regarding these Terms of Service, please contact us at{' '}
              <a href="mailto:info@maproduction.ae" className="text-primary hover:underline">
                info@maproduction.ae
              </a>
              .
            </p>
          </section>
        </div>
      </PageSection>
    </div>
  );
}
