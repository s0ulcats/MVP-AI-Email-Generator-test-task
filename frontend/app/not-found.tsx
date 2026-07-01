import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 text-center">
      <div className="flex max-w-md flex-col items-center gap-6">
        <span className="text-sm font-medium text-muted-foreground">404</span>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Page not found
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/" />}>
          Back to home
        </Button>
      </div>
    </main>
  )
}
