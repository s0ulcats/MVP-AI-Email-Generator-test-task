import { Badge } from "@/components/ui/badge"
import { EmailPreview } from "@/components/email-preview"
import { EXAMPLE_EMAIL } from "@/lib/constants"

export function ExampleSection() {
  return (
    <section id="example" className="border-b border-border scroll-mt-16">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center">
        <div className="flex flex-col gap-4">
          <Badge variant="secondary" className="w-fit">
            Live example
          </Badge>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            From a one-line prompt to a send-ready draft
          </h2>
          <p className="text-pretty leading-relaxed text-muted-foreground">
            Here&apos;s a persuasive, medium-length email generated from the
            prompt &ldquo;pitch our new onboarding flow.&rdquo; Every draft
            keeps a clear subject line and a natural structure you can edit in
            place.
          </p>
          <ul className="mt-2 flex flex-col gap-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
              Clear subject line generated automatically
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
              Natural greeting, body, and sign-off
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
              Copy to clipboard with a single click
            </li>
          </ul>
        </div>
        <EmailPreview
          subject={EXAMPLE_EMAIL.subject}
          body={EXAMPLE_EMAIL.body}
        />
      </div>
    </section>
  )
}
