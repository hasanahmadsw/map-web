import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { IIntent } from '@/types/intents/intent.type';

const FAQ_QUESTION_TEMPLATES: Array<{
  question: (topic: string, related?: string) => string;
  answer: (topic: string) => string;
}> = [
    {
      question: topic => `What types of ${topic} are available for rent?`,
      answer: topic =>
        `We offer a wide range of ${topic.toLowerCase()} for rent, from entry-level to professional grade. Browse our catalog to see available options, or contact us for personalized recommendations based on your project needs.`,
    },
    {
      question: topic => `How much does it cost to rent ${topic}?`,
      answer: () =>
        'Rental pricing varies based on equipment type, duration, and availability. We offer competitive rates for daily, weekly, and long-term rentals. Contact us or check individual equipment listings for detailed pricing.',
    },
    {
      question: topic => `What is included when renting ${topic}?`,
      answer: () =>
        'Each rental typically includes the main equipment, essential accessories, and basic support. Additional accessories and support packages can be added. Full details are provided when you request a quote.',
    },
    {
      question: topic => `How do I choose the right ${topic} for my project?`,
      answer: topic =>
        `Choosing the right ${topic.toLowerCase()} depends on your project requirements, budget, and timeline. Our team can help you select the best option—contact us for a free consultation.`,
    },
    {
      question: topic => `What are the rental terms for ${topic}?`,
      answer: () =>
        'Standard rental terms include insurance requirements, deposit, and return conditions. Minimum rental periods may apply for certain equipment. All terms are clearly communicated before your booking is confirmed.',
    },
    {
      question: topic => `Can I rent ${topic} for short-term projects?`,
      answer: () =>
        'Yes, we offer flexible rental periods from single days to several months. Short-term rentals are popular for productions, events, and one-off projects. Check availability for your preferred dates.',
    },
    {
      question: (topic, related) =>
        related
          ? `What is the difference between ${topic} and other ${related} options?`
          : `What should I consider when renting ${topic}?`,
      answer: topic =>
        `When renting ${topic.toLowerCase()}, consider your project specs, compatibility with existing equipment, and whether you need additional accessories. Our experts can guide you through the selection process.`,
    },
  ];

function generateFaqItems(intent: IIntent): Array<{ question: string; answer: string }> {
  const topic = intent.linkLabel || 'equipment';
  const relatedLabel = intent.internalLinks?.[0]?.linkLabel;

  return FAQ_QUESTION_TEMPLATES.map(({ question, answer }) => ({
    question: question(topic, relatedLabel),
    answer: answer(topic),
  }));
}

interface IntentFAQProps {
  intent: IIntent;
}

export function IntentFAQ({ intent }: IntentFAQProps) {
  const faqItems = generateFaqItems(intent);

  return (
    <section className="mt-12 border-t pt-8">
      <h2 className="mb-6 text-xl font-semibold">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="w-full">
        {faqItems.map((faq, index) => (
          <AccordionItem key={index} value={`faq-${index}`}>
            <AccordionTrigger className="text-left text-sm font-medium cursor-pointer">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
