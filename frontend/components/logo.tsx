import Link from "next/link"
import { Mail } from "lucide-react"
import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2 text-base font-semibold tracking-tight text-foreground",
        className,
      )}
    >
      <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Mail className="size-4" />
      </span>
      MailCraft
    </Link>
  )
}
