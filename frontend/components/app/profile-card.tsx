'use client'

import { useState } from 'react'
import { LogOut, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/providers/auth-provider'
import { logout } from '@/lib/api/auth'
import { updateMe } from '@/lib/api/user'
import { FadeIn } from '@/components/fade-in'
import { PLANS } from '@/lib/constants'

export function ProfileCard() {
  const { user, refreshUser, logout: authLogout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [isSaving, setIsSaving] = useState(false)

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'JD'

  const planLabel = PLANS.find((p) => p.value === user?.plan)?.label || user?.plan

  async function handleSave() {
    setIsSaving(true)
    try {
      await updateMe({ name })
      await refreshUser()
      setIsEditing(false)
      toast.success('Profile updated')
    } catch (error) {
      toast.error('Update failed', {
        description: error instanceof Error ? error.message : 'Please try again.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  async function handleLogout() {
    try {
      await logout()
      authLogout()
      toast.success('Signed out', { description: 'See you next time.' })
      window.location.href = '/login'
    } catch {
      toast.error('Logout failed')
    }
  }

  if (!user) return null

  return (
    <FadeIn>
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="text-base">Profile</CardTitle>
          <CardDescription>Manage your account details.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <Avatar size="lg">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-base font-medium text-foreground">{user.name}</span>
              <span className="text-sm text-muted-foreground">{user.email}</span>
            </div>
          </div>

          <Separator />

          <dl className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <dt className="text-sm text-muted-foreground">Name</dt>
              <dd className="text-sm font-medium text-foreground">
                {isEditing ? (
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-48 cursor-pointer"
                  />
                ) : (
                  user.name
                )}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-sm text-muted-foreground">Email</dt>
              <dd className="text-sm font-medium text-foreground">{user.email}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-sm text-muted-foreground">Plan</dt>
              <dd className="text-sm font-medium text-foreground">{planLabel}</dd>
            </div>
          </dl>

          <Separator />

          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false)
                    setName(user.name)
                  }}
                  disabled={isSaving}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving} className="cursor-pointer">
                  {isSaving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Save
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setIsEditing(true)} className="cursor-pointer">
                Edit
              </Button>
            )}
            <Button variant="outline" onClick={handleLogout} className="cursor-pointer ml-auto">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </FadeIn>
  )
}
