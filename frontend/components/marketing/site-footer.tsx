import Link from "next/link"
import { Logo } from "@/components/logo"

const footerLinks = [
  {
    heading: "Product",
    links: [
      { href: "/#features", label: "Features" },
      { href: "/pricing", label: "Pricing" },
      { href: "/dashboard", label: "Dashboard" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/#faq", label: "FAQ" },
      { href: "/login", label: "Login" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/", label: "Privacy" },
      { href: "/", label: "Terms" },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="flex flex-col gap-3 md:max-w-xs">
            <Logo />
            <p className="text-sm leading-relaxed text-muted-foreground">
              Professional emails, drafted in seconds. Pick a tone, set a
              length, and let AI do the writing.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {footerLinks.map((group) => (
              <div key={group.heading} className="flex flex-col gap-3">
                <h3 className="text-sm font-medium text-foreground">
                  {group.heading}
                </h3>
                <ul className="flex flex-col gap-2">
                  {group.links.map((link, index) => (
                    <li key={`${link.label}-${index}`}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MailCraft. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
