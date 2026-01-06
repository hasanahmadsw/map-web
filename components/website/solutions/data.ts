import { Award, Users, Settings, Shield, Clock, Building2, CheckCircle2, Zap } from 'lucide-react';

export const features = [
  {
    icon: Award,
    title: 'Unmatched Quality',
    description: 'Deliver exceptional results with our premium services and industry-leading standards.',
    color: 'text-blue-500',
  },
  {
    icon: Shield,
    title: 'Reliable Performance',
    description: 'Dependable solutions built to perform flawlessly in critical production environments.',
    color: 'text-green-500',
  },
  {
    icon: Settings,
    title: 'Tailored Flexibility',
    description: 'Customizable solutions that adapt to your unique project requirements.',
    color: 'text-purple-500',
  },
  {
    icon: Users,
    title: 'Expert Team',
    description: 'Experienced professionals dedicated to bringing your vision to life.',
    color: 'text-orange-500',
  },
  {
    icon: Zap,
    title: 'Efficient Delivery',
    description: 'Streamlined processes ensuring timely completion of your projects.',
    color: 'text-yellow-500',
  },
  {
    icon: CheckCircle2,
    title: 'End-to-End Support',
    description: 'Comprehensive support from initial consultation to final delivery.',
    color: 'text-red-500',
  },
];

export const stats = [
  { value: '500+', label: 'Projects Completed', icon: Building2 },
  { value: '100+', label: 'Satisfied Clients', icon: Users },
  { value: '25+', label: 'Years Experience', icon: Clock },
  { value: '24/7', label: 'Support Available', icon: Shield },
];

export const processSteps = [
  {
    step: '01',
    title: 'Consultation',
    description: 'Discuss your project requirements and objectives with our expert team',
  },
  {
    step: '02',
    title: 'Customization',
    description: 'We tailor the perfect solution to match your specific needs and goals',
  },
  {
    step: '03',
    title: 'Execution',
    description: 'Professional delivery with full support throughout the project lifecycle',
  },
];

export const useCases = [
  'Brand Marketing',
  'Corporate Communications',
  'Product Launches',
  'Event Coverage',
  'Content Creation',
  'Social Media',
  'Training & Education',
  'Documentation',
];
