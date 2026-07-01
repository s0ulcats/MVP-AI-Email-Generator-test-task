import Link from "next/link"
import { Logo } from "@/components/logo"

interface AuthShellProps {
  title: string
  description: string
  children: React.ReactNode
  footer: React.ReactNode
}

export function AuthShell({
  title,
  description,
  children,
  footer,
}: AuthShellProps) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 py-12">
      <div className="flex w-full max-w-sm flex-col gap-8">
        <div className="flex flex-col items-center gap-6 text-center">
          <Logo />
          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {title}
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
        {children}
        <p className="text-center text-sm text-muted-foreground">{footer}</p>
        <Link
          href="/"
          className="text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Back to home
        </Link>
      </div>
    </main>
  )
}
