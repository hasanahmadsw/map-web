import MotionWrapper from '@/components/shared/motion/motion-wrapper';
import { Accordion, AccordionItem, AccordionContent, AccordionTrigger } from '@/components/ui/accordion';
import { faqs } from '../home/data';

async function FAQAbout() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <MotionWrapper
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <MotionWrapper
            as="h2"
            className="mb-4 text-3xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Frequently Asked Questions
          </MotionWrapper>
          <MotionWrapper
            as="p"
            className="text-muted-foreground mx-auto max-w-3xl text-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Have questions about our services? We’ve got answers. Explore our most frequently asked questions
            to learn more about our process, offerings, and how we can help you achieve your goals.
          </MotionWrapper>
        </MotionWrapper>

        <MotionWrapper
          className="mx-auto max-w-3xl"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <MotionWrapper
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1 + 0.6,
                  ease: 'easeOut',
                }}
                viewport={{ once: true, margin: '-50px' }}
              >
                <AccordionItem value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-lg font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-lg">{faq.answer}</AccordionContent>
                </AccordionItem>
              </MotionWrapper>
            ))}
          </Accordion>
        </MotionWrapper>
      </div>
    </section>
  );
}

export default FAQAbout;
