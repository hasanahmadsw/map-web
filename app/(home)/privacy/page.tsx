import type { Metadata } from 'next';
import { createEnhancedMetadata } from '@/utils/seo/meta/enhanced-meta';
import { PageHero, PageSection } from '@/components/website/common/page-components';

export async function generateMetadata(): Promise<Metadata> {
  return createEnhancedMetadata({
    title: 'Privacy Policy | MAP Media Art Production',
    description:
      'Privacy policy for MAP Media Art Production. Learn how we collect, use, and protect your personal information.',
    pathname: '/privacy',
    mainOverrides: {
      category: 'Legal',
    },
  });
}

export default function PrivacyPage() {
  return (
    <div className="bg-background min-h-screen max-w-3xl mx-auto">
      <PageHero
        title="Privacy Policy"
        description="Your privacy is important to us. This policy outlines how MAP Media Art Production collects, uses, and protects your information."
        buttons={[{ text: 'Contact Us', href: '/contact' }]}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Privacy Policy' },
        ]}
        minHeight="40vh"
      />

      <PageSection>
        <div className="prose prose-neutral dark:prose-invert ">
          <p className="text-muted-foreground text-sm">Last updated: {new Date().toLocaleDateString('en-GB')}</p>

          <section className="mt-8 space-y-6">
            <h2 className="text-xl font-semibold">1. Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed">
              We collect information you provide directly to us, including name, email address, phone number, and
              project details when you contact us or request a quote. We may also collect usage data when you visit
              our website.
            </p>
          </section>

          <section className="mt-8 space-y-6">
            <h2 className="text-xl font-semibold">2. How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use the information we collect to respond to your enquiries, provide our services, improve our
              website, and communicate with you about our services. We do not sell your personal information to third
              parties.
            </p>
          </section>

          <section className="mt-8 space-y-6">
            <h2 className="text-xl font-semibold">3. Data Protection</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement appropriate security measures to protect your personal information. We retain your data only
              for as long as necessary to fulfil the purposes outlined in this policy.
            </p>
          </section>

          <section className="mt-8 space-y-6">
            <h2 className="text-xl font-semibold">4. Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our website may use cookies and similar technologies to enhance your experience and analyse site
              traffic. You can control cookie preferences through your browser settings.
            </p>
          </section>

          <section className="mt-8 space-y-6">
            <h2 className="text-xl font-semibold">5. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about this Privacy Policy or wish to exercise your rights regarding your
              personal data, please contact us at{' '}
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
