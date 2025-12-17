import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { faqs } from './data';

export function FAQSection() {
  return (
    <section className="relative w-full space-y-8 overflow-hidden py-16">
      <h2 className="text-center text-3xl font-semibold tracking-tight">Frequently Asked Questions</h2>

      <div className="glass-card container mx-auto max-w-4xl rounded-2xl p-6 px-4 md:p-8">
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
