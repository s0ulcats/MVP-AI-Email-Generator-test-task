import { History } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Empty } from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import { TONES } from '@/lib/constants'
import { FadeIn } from '@/components/fade-in'
import type { Tone, Length } from '@/types/api'

interface GenerationRecord {
  id: string
  topic: string
  tone: Tone
  length: Length
  subject: string
  createdAt: string
}

interface HistoryListProps {
  history: GenerationRecord[]
  isLoading?: boolean
  onSelect: (record: GenerationRecord) => void
}

function toneLabel(value: Tone) {
  return TONES.find((tone) => tone.value === value)?.label ?? value
}

export function HistoryList({ history, isLoading = false, onSelect }: HistoryListProps) {
  return (
    <aside className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <History className="size-4 text-muted-foreground" />
        <h2 className="text-sm font-medium text-foreground">Recent</h2>
      </div>
      {isLoading ? (
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : history.length === 0 ? (
        <Empty className="rounded-lg border border-dashed border-border py-10 text-sm text-muted-foreground">
          No generations yet.
        </Empty>
      ) : (
        <FadeIn>
          <ul className="flex flex-col gap-2">
            {history.map((record, index) => (
              <FadeIn key={record.id} delay={index * 0.05}>
                <li>
                  <button
                    type="button"
                    onClick={() => onSelect(record)}
                    className="flex w-full flex-col gap-1.5 rounded-lg border border-border bg-card p-3 text-left transition-colors hover:border-foreground/20 hover:bg-muted/50 cursor-pointer"
                  >
                    <span className="line-clamp-2 text-sm font-medium text-foreground">
                      {record.topic}
                    </span>
                    <span className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {toneLabel(record.tone)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{record.createdAt}</span>
                    </span>
                  </button>
                </li>
              </FadeIn>
            ))}
          </ul>
        </FadeIn>
      )}
    </aside>
  )
}
