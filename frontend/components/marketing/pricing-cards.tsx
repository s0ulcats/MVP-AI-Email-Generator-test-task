'use client'

import { useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { upgradePlan } from '@/lib/api/subscription'
import { useAuth } from '@/providers/auth-provider'
import { PLANS } from '@/lib/constants'
import { FadeIn } from '@/components/fade-in'

const PRICING_TIERS = [
  {
    name: 'Free',
    plan: 'FREE',
    price: '$0',
    period: '/month',
    description: 'Everything you need to start writing better emails.',
    features: ['5 emails per month', 'All tone presets', 'Short, medium & long lengths', 'Copy to clipboard'],
    cta: 'Current plan',
    highlighted: false,
  },
  {
    name: 'Pro',
    plan: 'PRO',
    price: '$12',
    period: '/month',
    description: 'For professionals who write emails every day.',
    features: ['Unlimited emails', 'Generation history', 'Priority generation speed', 'Saved templates', 'Email support'],
    cta: 'Upgrade to Pro',
    highlighted: true,
  },
  {
    name: 'Premium',
    plan: 'PREMIUM',
    price: '$29',
    period: '/month',
    description: 'Advanced controls for teams and power users.',
    features: ['Everything in Pro', 'Custom tone profiles', 'Team workspace', 'Brand voice training', 'Dedicated support'],
    cta: 'Upgrade to Premium',
    highlighted: false,
  },
]

export function PricingCards() {
  const { user, refreshUser } = useAuth()
  const [open, setOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [isUpgrading, setIsUpgrading] = useState(false)

  async function handleUpgrade(plan: string) {
    if (!user) {
      toast.error('Please log in to upgrade your plan')
      window.location.href = '/login'
      return
    }

    setSelectedPlan(plan)
    setIsUpgrading(true)
    try {
      await upgradePlan({ plan: plan as any })
      await refreshUser()
      setOpen(true)
      toast.success('Plan upgraded successfully')
    } catch (error) {
      toast.error('Upgrade failed', {
        description: error instanceof Error ? error.message : 'Please try again.',
      })
    } finally {
      setIsUpgrading(false)
    }
  }

  return (
    <>
      <FadeIn>
        <div className="grid gap-6 lg:grid-cols-3">
          {PRICING_TIERS.map((tier) => {
            const isCurrentPlan = user?.plan === tier.plan
            return (
              <Card
                key={tier.name}
                className={cn(
                  'flex flex-col shadow-none transition-colors hover:border-border/80',
                  tier.highlighted ? 'border-primary ring-1 ring-primary' : 'border-border',
                )}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{tier.name}</CardTitle>
                    {tier.highlighted && <Badge>Most popular</Badge>}
                  </div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-semibold tracking-tight text-foreground">
                      {tier.price}
                    </span>
                    <span className="text-sm text-muted-foreground">{tier.period}</span>
                  </div>
                  <CardDescription className="mt-2 leading-relaxed">{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="flex flex-col gap-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm text-foreground">
                        <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full cursor-pointer min-h-[44px]"
                    variant={tier.highlighted ? 'default' : 'outline'}
                    disabled={isCurrentPlan || isUpgrading}
                    onClick={() => handleUpgrade(tier.plan)}
                  >
                    {isUpgrading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {isCurrentPlan ? 'Current plan' : tier.cta}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </FadeIn>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upgrade successful</DialogTitle>
            <DialogDescription>
              You have been upgraded to the {selectedPlan} plan. Enjoy your new features!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setOpen(false)} className="cursor-pointer">
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
