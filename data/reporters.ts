export type Reporter = {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
  city?: string;
  country?: string;
  beats: string[];
  bio?: string;
  followers?: number;
  publications?: number;
};

export const reporters: Reporter[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    username: "sarahjohnson",
    avatarUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    city: "New York",
    country: "United States",
    beats: ["Politics", "Business"],
    bio: "Senior political correspondent covering Capitol Hill and economic policy. Former White House correspondent with 15+ years of experience.",
    followers: 125000,
    publications: 45,
  },
  {
    id: "2",
    name: "Ahmed Al-Zahra",
    username: "ahmedalzahra",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    city: "Dubai",
    country: "UAE",
    beats: ["Business", "Technology"],
    bio: "Tech and business journalist covering the Middle East's digital transformation and startup ecosystem.",
    followers: 89000,
    publications: 32,
  },
  {
    id: "3",
    name: "Marie Dubois",
    username: "mariedubois",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    city: "Paris",
    country: "France",
    beats: ["Culture", "Arts"],
    bio: "Cultural correspondent specializing in European arts, literature, and cultural policy. Regular contributor to major French publications.",
    followers: 67000,
    publications: 28,
  },
  {
    id: "4",
    name: "Rajesh Kumar",
    username: "rajeshkumar",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    city: "Mumbai",
    country: "India",
    beats: ["Technology", "Business"],
    bio: "Tech journalist covering India's booming startup scene and digital economy. Expert on fintech and e-commerce trends.",
    followers: 156000,
    publications: 67,
  },
  {
    id: "5",
    name: "Fatima Al-Rashid",
    username: "fatimaalrashid",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    city: "Riyadh",
    country: "Saudi Arabia",
    beats: ["Politics", "Society"],
    bio: "Political journalist covering social reforms and women's rights in the Kingdom. Breaking stories on Vision 2030 initiatives.",
    followers: 112000,
    publications: 41,
  },
  {
    id: "6",
    name: "David Thompson",
    username: "davidthompson",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    city: "London",
    country: "United Kingdom",
    beats: ["Sports", "Politics"],
    bio: "Sports and political journalist with a focus on the intersection of sports and society. Former professional football analyst.",
    followers: 98000,
    publications: 38,
  },
  {
    id: "7",
    name: "Carlos Silva",
    username: "carlossilva",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    city: "São Paulo",
    country: "Brazil",
    beats: ["Climate", "Environment"],
    bio: "Environmental journalist covering climate change in Latin America. Expert on Amazon rainforest conservation and renewable energy.",
    followers: 134000,
    publications: 52,
  },
  {
    id: "8",
    name: "Aisha Okonkwo",
    username: "aishaokonkwo",
    avatarUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
    city: "Lagos",
    country: "Nigeria",
    beats: ["Health", "Technology"],
    bio: "Health and tech journalist covering digital health innovations in Africa. Specializing in telemedicine and healthcare accessibility.",
    followers: 76000,
    publications: 29,
  },
  {
    id: "9",
    name: "James Wilson",
    username: "jameswilson",
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
    city: "San Francisco",
    country: "United States",
    beats: ["Technology", "Business"],
    bio: "Silicon Valley correspondent covering startups, venture capital, and emerging technologies. Former software engineer turned journalist.",
    followers: 189000,
    publications: 73,
  },
  {
    id: "10",
    name: "Yuki Tanaka",
    username: "yukitanaka",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    city: "Tokyo",
    country: "Japan",
    beats: ["Technology", "Culture"],
    bio: "Tech and culture journalist covering Japan's innovation landscape and its impact on global trends. Expert on robotics and AI.",
    followers: 145000,
    publications: 58,
  },
];

export function filterReporters(reporters: Reporter[], query: string): Reporter[] {
  if (!query.trim()) return reporters;

  const searchTerm = query.toLowerCase();

  return reporters.filter(
    (reporter) =>
      reporter.name.toLowerCase().includes(searchTerm) ||
      reporter.username.toLowerCase().includes(searchTerm) ||
      reporter.beats.some((beat) => beat.toLowerCase().includes(searchTerm)) ||
      reporter.country?.toLowerCase().includes(searchTerm) ||
      reporter.city?.toLowerCase().includes(searchTerm) ||
      reporter.bio?.toLowerCase().includes(searchTerm),
  );
}
