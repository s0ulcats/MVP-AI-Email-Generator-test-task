import { cn } from "@/lib/utils"

interface EmailPreviewProps {
  subject: string
  body: string
  className?: string
}

export function EmailPreview({ subject, body, className }: EmailPreviewProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
        <span className="size-2.5 rounded-full bg-muted-foreground/30" />
        <span className="size-2.5 rounded-full bg-muted-foreground/30" />
        <span className="size-2.5 rounded-full bg-muted-foreground/30" />
      </div>
      <div className="flex flex-col gap-1 border-b border-border px-5 py-4">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Subject
        </span>
        <p className="text-sm font-medium text-foreground">{subject}</p>
      </div>
      <div className="px-5 py-4">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
          {body}
        </p>
      </div>
    </div>
  )
}
