import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export interface FaqItem {
  q: string;
  a: string;
}

interface PageFaqProps {
  title?: string;
  items: FaqItem[];
}

export function PageFaq({ title = 'Frequently Asked Questions', items }: PageFaqProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold md:text-2xl">{title}</h2>
      <Accordion type="single" collapsible className="w-full">
        {items.map((faq, index) => (
          <AccordionItem key={index} value={`faq-${index}`}>
            <AccordionTrigger className="text-left text-sm font-medium">{faq.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm">{faq.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
