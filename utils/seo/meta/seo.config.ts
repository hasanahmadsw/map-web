const siteURL = process.env.NEXT_PUBLIC_SITE_URL!;

const seoConfig = {
  siteName: 'MAP',
  siteURL,
  // ogImage: `${siteURL}/images/og-image.jpg`,
  ogImage: `${siteURL}/logo.png`,
  logo: `${siteURL}/logo.png`,

  // Schema.org IDs
  websiteId: `${siteURL}#website`,
  organizationId: `${siteURL}#organization`,
};

export default seoConfig;
