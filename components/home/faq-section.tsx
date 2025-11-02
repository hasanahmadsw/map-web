import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Translations } from "@/utils/dictionary-utils"

interface FAQItem {
  question: string
  answer: string
}

interface FAQSectionProps {
  lang: string
  t: Translations
}

export function FAQSection({ lang, t }: FAQSectionProps) {
  // Sample FAQ data - can be moved to translations or API later
  const faqs: FAQItem[] = [
    {
      question: "What services do you offer?",
      answer: "We offer a comprehensive range of media production and broadcasting services including video production, live streaming, content creation, post-production, and technical consulting services tailored to your needs."
    },
    {
      question: "How long does a typical project take?",
      answer: "Project timelines vary depending on the scope and complexity. Simple projects may take a few days, while larger productions can take several weeks. We provide detailed timelines during the consultation phase."
    },
    {
      question: "Do you work with international clients?",
      answer: "Yes, we work with clients from around the world. Our team has experience in international projects and can accommodate different time zones and requirements."
    },
    {
      question: "What is your pricing structure?",
      answer: "Our pricing is customized based on project requirements. We offer transparent quotes after understanding your needs. Contact us for a detailed consultation and quote."
    },
    {
      question: "Can you handle large-scale events?",
      answer: "Absolutely! We specialize in large-scale broadcasting events and have the equipment and expertise to handle productions of any size, from small corporate events to major international broadcasts."
    }
  ]

  return (
    <section className="space-y-8 py-16">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-semibold tracking-tight">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="max-w-4xl mx-auto container px-4">
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

