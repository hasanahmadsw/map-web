import { BroadcastType } from '@/types/broadcasts/broadcast.enums';
import {
  Award,
  Briefcase,
  Building2,
  HeadphonesIcon,
  Clock,
  Radio,
  Shield,
  Truck,
  Users,
  Zap,
  CheckCircle2,
  Settings,
  Satellite,
} from 'lucide-react';

export const useCases = [
  'Live Sports Events',
  'Breaking News Coverage',
  'Corporate Conferences',
  'Music Festivals',
  'Political Broadcasts',
  'Religious Ceremonies',
  'Educational Webinars',
  'Product Launches',
];

export const stats = [
  { value: '500+', label: 'Productions', icon: Building2 },
  { value: '50+', label: 'Broadcast Units', icon: Radio },
  { value: '100+', label: 'Satisfied Clients', icon: Users },
  { value: '24/7', label: 'Support Available', icon: Clock },
];

export const processSteps = [
  {
    step: '01',
    title: 'Consultation',
    description: 'Discuss your production requirements and objectives with our expert team',
  },
  {
    step: '02',
    title: 'Customization',
    description: 'We tailor the perfect broadcast solution to match your specific needs',
  },
  {
    step: '03',
    title: 'Deployment',
    description: 'Rapid setup and deployment with full technical support throughout',
  },
];

export const broadcastTypes = [
  {
    type: BroadcastType.OBVAN,
    slug: 'obvan',
    label: 'OBVAN',
    icon: Truck,
    description:
      'State-of-the-art mobile broadcast vans designed for live events, sports coverage, and on-location production. Fully equipped with professional-grade equipment for seamless remote broadcasting.',
    features: ['Mobile Production', 'Live Event Coverage', 'Multi-Camera Setup', 'Real-time Broadcasting'],
  },
  {
    type: BroadcastType.FLIGHT_CASE,
    slug: 'flight-case',
    label: 'Flight Cases',
    icon: Briefcase,
    description:
      'Portable and compact broadcast equipment cases perfect for travel and remote productions. Engineered for durability and quick deployment in any location.',
    features: ['Portable Design', 'Quick Setup', 'Durable Construction', 'Travel-Friendly'],
  },
  {
    type: BroadcastType.SNG,
    slug: 'sng',
    label: 'SNG',
    icon: Satellite,
    description:
      'Satellite News Gathering units equipped with advanced transmission technology for reliable satellite communication and remote broadcasting from anywhere in the world.',
    features: ['Satellite Transmission', 'Global Coverage', 'Reliable Connectivity', 'Remote Broadcasting'],
  },
  // {
  //   type: BroadcastType.INTERNET_BROADCAST,
  //   slug: 'internet-broadcast',
  //   label: 'Internet Broadcast',
  //   icon: Wifi,
  //   description:
  //     'Professional solutions for online streaming and digital broadcasting. Perfect for webinars, live streaming, and digital content creation with high-quality output.',
  //   features: ['Online Streaming', 'Digital Broadcasting', 'Webinar Support', 'High-Quality Output'],
  // },
  // {
  //   type: BroadcastType.OTHER,
  //   slug: 'other',
  //   label: 'Other Solutions',
  //   icon: MoreHorizontal,
  //   description:
  //     'Specialized broadcast solutions tailored to unique production requirements. Custom configurations and specialized equipment for specific broadcasting needs.',
  //   features: ['Custom Solutions', 'Specialized Equipment', 'Tailored Configurations', 'Flexible Options'],
  // },
];

export const benefits = [
  {
    icon: Award,
    title: 'Professional Grade',
    description: 'Industry-standard equipment trusted by broadcast professionals worldwide',
    color: 'text-blue-500',
  },
  {
    icon: Shield,
    title: 'Reliable Performance',
    description: 'Tested and proven systems designed for demanding production environments',
    color: 'text-green-500',
  },
  {
    icon: Settings,
    title: 'Flexible Solutions',
    description: 'Customizable configurations to meet your specific production requirements',
    color: 'text-purple-500',
  },
  {
    icon: HeadphonesIcon,
    title: 'Expert Support',
    description: 'Comprehensive technical support and training from our experienced team',
    color: 'text-orange-500',
  },
  {
    icon: Zap,
    title: 'Quick Deployment',
    description: 'Rapid setup and deployment capabilities for time-sensitive productions',
    color: 'text-yellow-500',
  },
  {
    icon: CheckCircle2,
    title: 'Quality Assurance',
    description: 'Rigorous testing and quality control ensuring flawless broadcast delivery',
    color: 'text-red-500',
  },
];
