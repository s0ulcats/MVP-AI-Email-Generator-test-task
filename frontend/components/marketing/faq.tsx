import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { FadeIn } from '@/components/fade-in'

export const faqs = [
  {
    question: 'How does the email generator work?',
    answer: 'Describe what your email is about, pick a tone and length, and the generator drafts a complete, ready-to-send email in seconds.',
  },
  {
    question: 'Can I control the tone of voice?',
    answer: 'Yes. Choose from Professional, Friendly, Persuasive, Casual, or Formal tones so every email matches the relationship and context.',
  },
  {
    question: 'Is my data kept private?',
    answer: 'Your prompts and generated emails are never shared or used to train public models. You stay in full control of your content.',
  },
  {
    question: 'Do I need a credit card to start?',
    answer: 'No. The Free plan lets you generate 5 emails per month without entering payment details. Upgrade only when you need more.',
  },
  {
    question: 'Can I use the emails for business?',
    answer: 'Absolutely. Every email you generate is yours to use for personal or commercial purposes without restrictions.',
  },
]

export function Faq() {
  return (
    <section id="faq" className="border-b border-border scroll-mt-16">
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <FadeIn className="text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Everything you need to know before you get started.
          </p>
        </FadeIn>
        <Accordion className="mt-10">
          {faqs.map((item, index) => (
            <FadeIn key={index} delay={index * 0.1}>
              <AccordionItem value={`item-${index}`}>
                <AccordionTrigger className="text-base cursor-pointer">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="leading-relaxed text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            </FadeIn>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
