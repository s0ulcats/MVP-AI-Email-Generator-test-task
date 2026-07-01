'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
}

export function BottomSheet({ isOpen, onClose, children, title }: BottomSheetProps) {
  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/40 md:hidden"
        onClick={onClose}
      >
        <div
          className="absolute bottom-0 left-0 right-0 max-h-[80vh] rounded-t-2xl bg-background shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-center pt-2 pb-1">
            <div className="h-1.5 w-12 rounded-full bg-muted-foreground/30" />
          </div>

          <div className="flex items-center justify-between border-b border-border p-4">
            {title && (
              <h3 className="text-sm font-semibold text-foreground">
                {title}
              </h3>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="ml-auto cursor-pointer min-h-[44px]"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="overflow-y-auto p-4" style={{ maxHeight: 'calc(80vh - 100px)' }}>
            {children}
          </div>
        </div>
      </div>
    </>
  )
}
