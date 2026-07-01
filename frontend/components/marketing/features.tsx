import { Sparkles, SlidersHorizontal, Clock, ShieldCheck } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { FadeIn } from '@/components/fade-in'

const features = [
  {
    icon: Sparkles,
    title: 'AI-drafted in seconds',
    description: 'Turn a short description into a complete, well-structured email without staring at a blank page.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Tone & length control',
    description: 'Switch between formal, friendly, persuasive, or casual, and choose short, medium, or long output.',
  },
  {
    icon: Clock,
    title: 'Save hours every week',
    description: 'Stop rewriting the same messages. Generate, tweak, and send in a fraction of the time.',
  },
  {
    icon: ShieldCheck,
    title: 'Private by default',
    description: 'Your prompts and drafts stay yours. Nothing is shared or used to train public models.',
  },
]

export function Features() {
  return (
    <section id="features" className="border-b border-border scroll-mt-16">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Everything you need to write better email
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            A focused toolset that gets you from idea to send-ready draft without the clutter.
          </p>
        </FadeIn>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <FadeIn key={feature.title} delay={index * 0.1}>
              <Card className="border-border shadow-none transition-colors hover:border-border/80 cursor-pointer">
                <CardHeader>
                  <span className="mb-3 flex size-9 items-center justify-center rounded-lg border border-border text-foreground">
                    <feature.icon className="size-4.5" />
                  </span>
                  <CardTitle className="text-base">{feature.title}</CardTitle>
                  <CardDescription className="leading-relaxed">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
