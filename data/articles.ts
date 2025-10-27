import type { Article } from "./types";

export type { Article };

export const articles: Record<string, Article[]> = {
  "1": [
    {
      id: "1-1",
      slug: "new-economic-policy-sparks-debate-in-congress",
      title: "New Economic Policy Sparks Debate in Congress",
      excerpt:
        "The proposed legislation aims to address income inequality while maintaining economic growth, but faces opposition from both parties.",
      publishedAt: "2024-01-15",
      readTime: 5,
      url: "#",
      topic: {
        slug: "politics",
        name: "Politics",
        description: "Latest political news, policy updates, and government developments from around the world.",
      },
      tags: [
        {
          slug: "economy",
          name: "Economy",
          description: "Economic news, policy updates, and economic developments from around the world.",
        },
        {
          slug: "congress",
          name: "Congress",
          description: "Congress news, policy updates, and government developments from around the world.",
        },
        {
          slug: "policy",
          name: "Policy",
          description: "Policy news, policy updates, and government developments from around the world.",
        },
      ],
      author: {
        id: "author-1",
        name: "Sarah Johnson",
        bio: "Senior political correspondent with over 10 years of experience covering Congress and federal policy. Specializes in economic legislation and regulatory reform.",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        role: "Political Correspondent",
        twitter: "https://twitter.com/sarahjohnson",
        linkedin: "https://linkedin.com/in/sarahjohnson",
        website: "https://sarahjohnson.com",
      },
    },
    {
      id: "1-2",
      slug: "tech-giants-face-increased-regulatory-scrutiny",
      title: "Tech Giants Face Increased Regulatory Scrutiny",
      excerpt:
        "Federal agencies are considering new antitrust measures that could reshape the digital economy landscape.",
      publishedAt: "2024-01-10",
      readTime: 7,
      url: "#",
      topic: {
        slug: "technology",
        name: "Technology",
        description: "Latest technology news, policy updates, and technology developments from around the world.",
      },
      tags: [
        {
          slug: "regulation",
          name: "Regulation",
          description: "Regulation news, policy updates, and regulation developments from around the world.",
        },
        {
          slug: "antitrust",
          name: "Antitrust",
          description: "Antitrust news, policy updates, and antitrust developments from around the world.",
        },
        {
          slug: "big-tech",
          name: "Big Tech",
          description: "Big Tech news, policy updates, and big tech developments from around the world.",
        },
      ],
      author: {
        id: "author-2",
        name: "Michael Chen",
        bio: "Technology journalist and former software engineer. Covers regulatory developments, antitrust cases, and the intersection of technology and policy.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        role: "Technology Journalist",
        twitter: "https://twitter.com/michaelchen",
        linkedin: "https://linkedin.com/in/michaelchen",
      },
    },
  ],
  "2": [
    {
      id: "2-1",
      slug: "dubai-ai-hub-attracts-global-tech-talent",
      title: "Dubai's AI Hub Attracts Global Tech Talent",
      excerpt:
        "The emirate's strategic investments in artificial intelligence are creating new opportunities for startups and established companies.",
      publishedAt: "2024-01-14",
      readTime: 6,
      url: "#",
      topic: {
        slug: "technology",
        name: "Technology",
        description: "Latest technology news, policy updates, and technology developments from around the world.",
      },
      tags: [
        {
          slug: "ai",
          name: "AI",
          description: "AI news, policy updates, and ai developments from around the world.",
        },
        {
          slug: "dubai",
          name: "Dubai",
          description: "Dubai news, policy updates, and dubai developments from around the world.",
        },
        {
          slug: "startups",
          name: "Startups",
          description: "Startups news, policy updates, and startups developments from around the world.",
        },
      ],
      author: {
        id: "author-3",
        name: "Aisha Rahman",
        bio: "Middle East technology correspondent covering innovation hubs, startup ecosystems, and digital transformation across the region.",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        role: "Middle East Tech Correspondent",
        twitter: "https://twitter.com/aisharahman",
        linkedin: "https://linkedin.com/in/aisharahman",
      },
    },
    {
      id: "2-2",
      slug: "middle-east-fintech-revolution-accelerates",
      title: "Middle East Fintech Revolution Accelerates",
      excerpt: "Digital banking and payment solutions are transforming financial services across the region.",
      publishedAt: "2024-01-08",
      readTime: 4,
      url: "#",
      topic: {
        slug: "finance",
        name: "Finance",
        description: "Latest finance news, policy updates, and finance developments from around the world.",
      },
      tags: [
        {
          slug: "fintech",
          name: "Fintech",
          description: "Fintech news, policy updates, and fintech developments from around the world.",
        },
        {
          slug: "digital-banking",
          name: "Digital Banking",
          description: "Digital Banking news, policy updates, and digital banking developments from around the world.",
        },
        {
          slug: "middle-east",
          name: "Middle East",
          description: "Middle East news, policy updates, and middle east developments from around the world.",
        },
      ],
      author: {
        id: "author-4",
        name: "David Kim",
        bio: "Financial technology journalist with expertise in digital banking, fintech innovation, and emerging markets.",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        role: "Fintech Journalist",
        twitter: "https://twitter.com/davidkim",
        linkedin: "https://linkedin.com/in/davidkim",
      },
    },
  ],
  "3": [
    {
      id: "3-1",
      slug: "paris-fashion-week-sustainability-takes-center-stage",
      title: "Paris Fashion Week: Sustainability Takes Center Stage",
      excerpt:
        "Designers are embracing eco-friendly materials and ethical production methods in response to consumer demand.",
      publishedAt: "2024-01-13",
      readTime: 8,
      url: "#",
      topic: {
        slug: "fashion",
        name: "Fashion",
        description: "Latest fashion news, policy updates, and fashion developments from around the world.",
      },
      tags: [
        {
          slug: "sustainability",
          name: "Sustainability",
          description: "Sustainability news, policy updates, and sustainability developments from around the world.",
        },
        {
          slug: "paris",
          name: "Paris",
          description: "Paris news, policy updates, and paris developments from around the world.",
        },
        {
          slug: "eco-friendly",
          name: "Eco-friendly",
          description: "Eco-friendly news, policy updates, and eco-friendly developments from around the world.",
        },
      ],
      author: {
        id: "author-5",
        name: "Emily Lee",
        bio: "Fashion journalist specializing in sustainable fashion, ethical production, and consumer trends.",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        role: "Fashion Journalist",
        twitter: "https://twitter.com/emilylee",
        linkedin: "https://linkedin.com/in/emilylee",
      },
    },
    {
      id: "3-2",
      slug: "european-cultural-funding-faces-cuts",
      title: "European Cultural Funding Faces Cuts",
      excerpt: "Arts organizations across the continent are concerned about proposed budget reductions.",
      publishedAt: "2024-01-06",
      readTime: 5,
      url: "#",
      topic: {
        slug: "culture",
        name: "Culture",
        description: "Latest culture news, policy updates, and culture developments from around the world.",
      },
      tags: [
        {
          slug: "arts",
          name: "Arts",
          description: "Arts news, policy updates, and arts developments from around the world.",
        },
        {
          slug: "funding",
          name: "Funding",
          description: "Funding news, policy updates, and funding developments from around the world.",
        },
        {
          slug: "europe",
          name: "Europe",
          description: "Europe news, policy updates, and europe developments from around the world.",
        },
      ],
      author: {
        id: "author-6",
        name: "James Chen",
        bio: "Arts and culture correspondent covering European arts, literature, and cultural policy. Regular contributor to major French publications.",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        role: "Arts and Culture Correspondent",
        twitter: "https://twitter.com/jameschen",
        linkedin: "https://linkedin.com/in/jameschen",
      },
    },
  ],
  "4": [
    {
      id: "4-1",
      slug: "india-startup-ecosystem-reaches-new-heights",
      title: "India's Startup Ecosystem Reaches New Heights",
      excerpt:
        "Record-breaking funding rounds and innovative business models are putting India on the global tech map.",
      publishedAt: "2024-01-12",
      readTime: 6,
      url: "#",
      topic: {
        slug: "business",
        name: "Business",
        description: "Latest business news, policy updates, and business developments from around the world.",
      },
      tags: [
        {
          slug: "startups",
          name: "Startups",
          description: "Startups news, policy updates, and startups developments from around the world.",
        },
        {
          slug: "funding",
          name: "Funding",
          description: "Funding news, policy updates, and funding developments from around the world.",
        },
        {
          slug: "india",
          name: "India",
          description: "India news, policy updates, and india developments from around the world.",
        },
      ],
      author: {
        id: "author-7",
        name: "Rajesh Kumar",
        bio: "Tech journalist covering India's booming startup scene and digital economy. Expert on fintech and e-commerce trends.",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        role: "Tech Journalist",
        twitter: "https://twitter.com/rajeshkumar",
        linkedin: "https://linkedin.com/in/rajeshkumar",
      },
    },
    {
      id: "4-2",
      slug: "digital-payments-transform-rural-india",
      title: "Digital Payments Transform Rural India",
      excerpt: "Mobile banking solutions are bringing financial inclusion to previously underserved communities.",
      publishedAt: "2024-01-05",
      readTime: 4,
      url: "#",
      topic: {
        slug: "finance",
        name: "Finance",
        description: "Latest finance news, policy updates, and finance developments from around the world.",
      },
      tags: [
        {
          slug: "digital-payments",
          name: "Digital Payments",
          description:
            "Digital Payments news, policy updates, and digital payments developments from around the world.",
        },
        {
          slug: "financial-inclusion",
          name: "Financial Inclusion",
          description:
            "Financial Inclusion news, policy updates, and financial inclusion developments from around the world.",
        },
        {
          slug: "rural",
          name: "Rural",
          description: "Rural news, policy updates, and rural developments from around the world.",
        },
      ],
      author: {
        id: "author-8",
        name: "Aisha Rahman",
        bio: "Financial technology journalist with expertise in digital banking, fintech innovation, and emerging markets.",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        role: "Fintech Journalist",
        twitter: "https://twitter.com/aisharahman",
        linkedin: "https://linkedin.com/in/aisharahman",
      },
    },
  ],
  "5": [
    {
      id: "5-1",
      slug: "saudi-womens-rights-reforms-continue",
      title: "Saudi Women's Rights Reforms Continue",
      excerpt: "Recent policy changes are opening new opportunities for women in education and employment.",
      publishedAt: "2024-01-11",
      readTime: 7,
      url: "#",
      topic: {
        slug: "politics",
        name: "Politics",
        description: "Latest political news, policy updates, and government developments from around the world.",
      },
      tags: [
        {
          slug: "women's-rights",
          name: "Women's Rights",
          description: "Women's Rights news, policy updates, and women's rights developments from around the world.",
        },
        {
          slug: "saudi-arabia",
          name: "Saudi Arabia",
          description: "Saudi Arabia news, policy updates, and saudi arabia developments from around the world.",
        },
        {
          slug: "reforms",
          name: "Reforms",
          description: "Reforms news, policy updates, and reforms developments from around the world.",
        },
      ],
      author: {
        id: "author-9",
        name: "James Chen",
        bio: "Arts and culture correspondent covering European arts, literature and cultural policy. Regular contributor to major French publications.",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        role: "Arts and Culture Correspondent",
        twitter: "https://twitter.com/jameschen",
        linkedin: "https://linkedin.com/in/jameschen",
      },
    },
    {
      id: "5-2",
      slug: "vision-2030-progress-report",
      title: "Vision 2030: Progress Report",
      excerpt: "The Kingdom's ambitious reform agenda is showing measurable results across multiple sectors.",
      publishedAt: "2024-01-04",
      readTime: 9,
      url: "#",
      topic: {
        slug: "politics",
        name: "Politics",
        description: "Latest political news, policy updates, and government developments from around the world.",
      },
      tags: [
        {
          slug: "vision-2030",
          name: "Vision 2030",
          description: "Vision 2030 news, policy updates, and vision 2030 developments from around the world.",
        },
        {
          slug: "saudi-arabia",
          name: "Saudi Arabia",
          description: "Saudi Arabia news, policy updates, and saudi arabia developments from around the world.",
        },
        {
          slug: "reforms",
          name: "Reforms",
          description: "Reforms news, policy updates, and reforms developments from around the world.",
        },
      ],
      author: {
        id: "author-10",
        name: "James Chen",
        bio: "Arts and culture correspondent covering European arts, literature and cultural policy. Regular contributor to major French publications.",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        role: "Arts and Culture Correspondent",
        twitter: "https://twitter.com/jameschen",
        linkedin: "https://linkedin.com/in/jameschen",
      },
    },
  ],
  "6": [
    {
      id: "6-1",
      slug: "premier-leagues-global-influence-grows",
      title: "Premier League's Global Influence Grows",
      excerpt: "International broadcasting deals and digital platforms are expanding the league's reach worldwide.",
      publishedAt: "2024-01-10",
      readTime: 5,
      url: "#",
      topic: {
        slug: "sports",
        name: "Sports",
        description: "Latest sports news, policy updates, and sports developments from around the world.",
      },
      tags: [
        {
          slug: "premier-league",
          name: "Premier League",
          description: "Premier League news, policy updates, and premier league developments from around the world.",
        },
        {
          slug: "broadcasting",
          name: "Broadcasting",
          description: "Broadcasting news, policy updates, and broadcasting developments from around the world.",
        },
        {
          slug: "global",
          name: "Global",
          description: "Global news, policy updates, and global developments from around the world.",
        },
      ],
      author: {
        id: "author-11",
        name: "James Chen",
        bio: "Arts and culture correspondent covering European arts, literature and cultural policy. Regular contributor to major French publications.",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        role: "Arts and Culture Correspondent",
        twitter: "https://twitter.com/jameschen",
        linkedin: "https://linkedin.com/in/jameschen",
      },
    },
    {
      id: "6-2",
      slug: "sports-and-politics-the-intersection",
      title: "Sports and Politics: The Intersection",
      excerpt: "How athletic achievements are influencing political discourse and social movements.",
      publishedAt: "2024-01-03",
      readTime: 6,
      url: "#",
      topic: {
        slug: "sports",
        name: "Sports",
        description: "Latest sports news, policy updates, and sports developments from around the world.",
      },
      tags: [
        {
          slug: "politics",
          name: "Politics",
          description: "Politics news, policy updates, and politics developments from around the world.",
        },
        {
          slug: "social-movements",
          name: "Social Movements",
          description:
            "Social Movements news, policy updates, and social movements developments from around the world.",
        },
        {
          slug: "athletics",
          name: "Athletics",
          description: "Athletics news, policy updates, and athletics developments from around the world.",
        },
      ],
      author: {
        id: "author-12",
        name: "James Chen",
        bio: "Arts and culture correspondent covering European arts, literature and cultural policy. Regular contributor to major French publications.",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        role: "Arts and Culture Correspondent",
        twitter: "https://twitter.com/jameschen",
        linkedin: "https://linkedin.com/in/jameschen",
      },
    },
  ],
  "7": [
    {
      id: "7-1",
      slug: "amazon-rainforest-conservation-efforts-intensify",
      title: "Amazon Rainforest Conservation Efforts Intensify",
      excerpt: "New international partnerships are working to protect the world's largest tropical rainforest.",
      publishedAt: "2024-01-09",
      readTime: 8,
      url: "#",
      topic: {
        slug: "environment",
        name: "Environment",
        description: "Latest environment news, policy updates, and environment developments from around the world.",
      },
      tags: [
        {
          slug: "conservation",
          name: "Conservation",
          description: "Conservation news, policy updates, and conservation developments from around the world.",
        },
        {
          slug: "rainforest",
          name: "Rainforest",
          description: "Rainforest news, policy updates, and rainforest developments from around the world.",
        },
        {
          slug: "partnerships",
          name: "Partnerships",
          description: "Partnerships news, policy updates, and partnerships developments from around the world.",
        },
      ],
      author: {
        id: "author-13",
        name: "James Chen",
        bio: "Arts and culture correspondent covering European arts, literature and cultural policy. Regular contributor to major French publications.",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        role: "Arts and Culture Correspondent",
        twitter: "https://twitter.com/jameschen",
        linkedin: "https://linkedin.com/in/jameschen",
      },
    },
    {
      id: "7-2",
      slug: "brazil-leads-latin-americas-renewable-energy-push",
      title: "Brazil Leads Latin America's Renewable Energy Push",
      excerpt: "Solar and wind power investments are transforming the country's energy landscape.",
      publishedAt: "2024-01-02",
      readTime: 5,
      url: "#",
      topic: {
        slug: "environment",
        name: "Environment",
        description: "Latest environment news, policy updates, and environment developments from around the world.",
      },
      tags: [
        {
          slug: "renewable-energy",
          name: "Renewable Energy",
          description:
            "Renewable Energy news, policy updates, and renewable energy developments from around the world.",
        },
        {
          slug: "brazil",
          name: "Brazil",
          description: "Brazil news, policy updates, and brazil developments from around the world.",
        },
        {
          slug: "solar",
          name: "Solar",
          description: "Solar news, policy updates, and solar developments from around the world.",
        },
      ],
      author: {
        id: "author-14",
        name: "James Chen",
        bio: "Arts and culture correspondent covering European arts, literature and cultural policy. Regular contributor to major French publications.",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        role: "Arts and Culture Correspondent",
        twitter: "https://twitter.com/jameschen",
        linkedin: "https://linkedin.com/in/jameschen",
      },
    },
  ],
  "8": [
    {
      id: "8-1",
      slug: "telemedicine-revolutionizes-healthcare-in-africa",
      title: "Telemedicine Revolutionizes Healthcare in Africa",
      excerpt: "Digital health platforms are providing access to medical care in remote regions.",
      publishedAt: "2024-01-08",
      readTime: 6,
      url: "#",
      topic: {
        slug: "healthcare",
        name: "Healthcare",
        description: "Latest healthcare news, policy updates, and healthcare developments from around the world.",
      },
      tags: [
        {
          slug: "telemedicine",
          name: "Telemedicine",
          description: "Telemedicine news, policy updates, and telemedicine developments from around the world.",
        },
        {
          slug: "digital-health",
          name: "Digital Health",
          description: "Digital Health news, policy updates, and digital health developments from around the world.",
        },
        {
          slug: "africa",
          name: "Africa",
          description: "Africa news, policy updates, and africa developments from around the world.",
        },
      ],
      author: {
        id: "author-15",
        name: "James Chen",
        bio: "Arts and culture correspondent covering European arts, literature and cultural policy. Regular contributor to major French publications.",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        role: "Arts and Culture Correspondent",
        twitter: "https://twitter.com/jameschen",
        linkedin: "https://linkedin.com/in/jameschen",
      },
    },
    {
      id: "8-2",
      slug: "nigerian-tech-startups-address-healthcare-challenges",
      title: "Nigerian Tech Startups Address Healthcare Challenges",
      excerpt: "Innovative solutions are improving maternal and child health outcomes across the country.",
      publishedAt: "2024-01-01",
      readTime: 4,
      url: "#",
      topic: {
        slug: "healthcare",
        name: "Healthcare",
        description: "Latest healthcare news, policy updates, and healthcare developments from around the world.",
      },
      tags: [
        {
          slug: "healthcare",
          name: "Healthcare",
          description: "Healthcare news, policy updates, and healthcare developments from around the world.",
        },
        {
          slug: "tech-startups",
          name: "Tech Startups",
          description: "Tech Startups news, policy updates, and tech startups developments from around the world.",
        },
        {
          slug: "nigeria",
          name: "Nigeria",
          description: "Nigeria news, policy updates, and nigeria developments from around the world.",
        },
      ],
      author: {
        id: "author-16",
        name: "James Chen",
        bio: "Arts and culture correspondent covering European arts, literature and cultural policy. Regular contributor to major French publications.",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        role: "Arts and Culture Correspondent",
        twitter: "https://twitter.com/jameschen",
        linkedin: "https://linkedin.com/in/jameschen",
      },
    },
  ],
  "9": [
    {
      id: "9-1",
      slug: "silicon-valleys-next-big-thing-ai-ethics",
      title: "Silicon Valley's Next Big Thing: AI Ethics",
      excerpt: "Tech companies are grappling with the moral implications of artificial intelligence development.",
      publishedAt: "2024-01-07",
      readTime: 7,
      url: "#",
      topic: {
        slug: "technology",
        name: "Technology",
        description: "Latest technology news, policy updates, and technology developments from around the world.",
      },
      tags: [
        {
          slug: "ai-ethics",
          name: "AI Ethics",
          description: "AI Ethics news, policy updates, and ai ethics developments from around the world.",
        },
        {
          slug: "silicon-valley",
          name: "Silicon Valley",
          description: "Silicon Valley news, policy updates, and silicon valley developments from around the world.",
        },
        {
          slug: "moral-implications",
          name: "Moral Implications",
          description:
            "Moral Implications news, policy updates, and moral implications developments from around the world.",
        },
      ],
      author: {
        id: "author-17",
        name: "James Chen",
        bio: "Arts and culture correspondent covering European arts, literature and cultural policy. Regular contributor to major French publications.",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        role: "Arts and Culture Correspondent",
        twitter: "https://twitter.com/jameschen",
        linkedin: "https://linkedin.com/in/jameschen",
      },
    },
    {
      id: "9-2",
      slug: "venture-capital-trends-whats-hot-in-2024",
      title: "Venture Capital Trends: What's Hot in 2024",
      excerpt: "Investors are betting big on climate tech, health tech, and Web3 innovations.",
      publishedAt: "2023-12-31",
      readTime: 8,
      url: "#",
      topic: {
        slug: "business",
        name: "Business",
        description: "Latest business news, policy updates, and business developments from around the world.",
      },
      tags: [
        {
          slug: "venture-capital",
          name: "Venture Capital",
          description: "Venture Capital news, policy updates, and venture capital developments from around the world.",
        },
        {
          slug: "climate-tech",
          name: "Climate Tech",
          description: "Climate Tech news, policy updates, and climate tech developments from around the world.",
        },
        {
          slug: "health-tech",
          name: "Health Tech",
          description: "Health Tech news, policy updates, and health tech developments from around the world.",
        },
      ],
      author: {
        id: "author-18",
        name: "James Chen",
        bio: "Arts and culture correspondent covering European arts, literature and cultural policy. Regular contributor to major French publications.",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        role: "Arts and Culture Correspondent",
        twitter: "https://twitter.com/jameschen",
        linkedin: "https://linkedin.com/in/jameschen",
      },
    },
  ],
  "10": [
    {
      id: "10-1",
      slug: "japans-robotics-industry-sets-global-standards",
      title: "Japan's Robotics Industry Sets Global Standards",
      excerpt: "Advanced automation technologies are reshaping manufacturing and service industries worldwide.",
      publishedAt: "2024-01-06",
      readTime: 6,
      url: "#",
      topic: {
        slug: "technology",
        name: "Technology",
        description: "Latest technology news, policy updates, and technology developments from around the world.",
      },
      tags: [
        {
          slug: "robotics",
          name: "Robotics",
          description: "Robotics news, policy updates, and robotics developments from around the world.",
        },
        {
          slug: "automation",
          name: "Automation",
          description: "Automation news, policy updates, and automation developments from around the world.",
        },
        {
          slug: "manufacturing",
          name: "Manufacturing",
          description: "Manufacturing news, policy updates, and manufacturing developments from around the world.",
        },
      ],
      author: {
        id: "author-19",
        name: "James Chen",
        bio: "Arts and culture correspondent covering European arts, literature and cultural policy. Regular contributor to major French publications.",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        role: "Arts and Culture Correspondent",
        twitter: "https://twitter.com/jameschen",
        linkedin: "https://linkedin.com/in/jameschen",
      },
    },
    {
      id: "10-2",
      slug: "ai-and-japanese-culture-a-harmonious-blend",
      title: "AI and Japanese Culture: A Harmonious Blend",
      excerpt: "How artificial intelligence is being integrated into traditional Japanese values and practices.",
      publishedAt: "2023-12-30",
      readTime: 5,
      url: "#",
      topic: {
        slug: "technology",
        name: "Technology",
        description: "Latest technology news, policy updates, and technology developments from around the world.",
      },
      tags: [
        {
          slug: "ai",
          name: "AI",
          description: "AI news, policy updates, and ai developments from around the world.",
        },
        {
          slug: "japanese-culture",
          name: "Japanese Culture",
          description:
            "Japanese Culture news, policy updates, and japanese culture developments from around the world.",
        },
        {
          slug: "integration",
          name: "Integration",
          description: "Integration news, policy updates, and integration developments from around the world.",
        },
      ],
      author: {
        id: "author-20",
        name: "James Chen",
        bio: "Arts and culture correspondent covering European arts, literature and cultural policy. Regular contributor to major French publications.",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        role: "Arts and Culture Correspondent",
        twitter: "https://twitter.com/jameschen",
        linkedin: "https://linkedin.com/in/jameschen",
      },
    },
  ],
};
