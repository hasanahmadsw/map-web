const siteURL = process.env.NEXT_PUBLIC_SITE_URL;

const seoConfig = {
   siteName: "blendlabNews",
   siteURL,
   ogImage: `${siteURL}/images/og-image.jpg`,
   logo: `${siteURL}/logo.png`,
};

export default seoConfig;
