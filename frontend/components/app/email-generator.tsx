'use client'

import { useState, useEffect } from 'react'
import { Sparkles, Loader2, History } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ResultPanel } from '@/components/app/result-panel'
import { HistoryList } from '@/components/app/history-list'
import { BottomSheet } from '@/components/layout/bottom-sheet'
import { generateEmail, getHistory } from '@/lib/api/generate'
import { LENGTHS, TONES } from '@/lib/constants'
import { FadeIn } from '@/components/fade-in'
import type { Generation, Tone, Length } from '@/types/api'

interface GenerationRecord {
  id: string
  topic: string
  tone: Tone
  length: Length
  subject: string
  createdAt: string
}

export function EmailGenerator() {
  const [topic, setTopic] = useState('')
  const [tone, setTone] = useState<Tone>('PROFESSIONAL')
  const [length, setLength] = useState<Length>('MEDIUM')
  const [topicError, setTopicError] = useState<string>()
  const [result, setResult] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [history, setHistory] = useState<GenerationRecord[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  useEffect(() => {
    loadHistory()
  }, [])

  async function loadHistory() {
    try {
      const data = await getHistory()
      setHistory(
        data.map((item) => ({
          id: item.id,
          topic: item.topic,
          tone: item.tone,
          length: item.length,
          subject: item.content.split('\n')[0] || item.topic,
          createdAt: new Date(item.createdAt).toLocaleDateString(),
        })),
      )
    } catch {
      setHistory([])
    } finally {
      setIsLoadingHistory(false)
    }
  }

  async function handleGenerate() {
    if (!topic.trim()) {
      setTopicError('Please describe what the email should be about.')
      return
    }
    setTopicError(undefined)
    setIsGenerating(true)
    setResult(null)

    try {
      const generation = await generateEmail({ topic: topic.trim(), tone, length })
      setResult(generation.content)
      await loadHistory()
      toast.success('Email generated')
    } catch (error) {
      toast.error('Generation failed', {
        description: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
      })
    } finally {
      setIsGenerating(false)
    }
  }

  function handleSelectHistory(record: GenerationRecord) {
    setTopic(record.topic)
    setTone(record.tone)
    setLength(record.length)
    setTopicError(undefined)
  }

  return (
    <FadeIn>
      <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-border bg-card p-5">
            <FieldGroup>
              <Field data-invalid={!!topicError || undefined}>
                <FieldLabel htmlFor="topic">What is the email about?</FieldLabel>
                <Textarea
                  id="topic"
                  rows={4}
                  placeholder="e.g. Follow up with a client after our product demo and propose next steps"
                  value={topic}
                  aria-invalid={!!topicError || undefined}
                  onChange={(e) => setTopic(e.target.value)}
                  className="cursor-pointer text-base"
                />
                <FieldError>{topicError}</FieldError>
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="tone">Tone</FieldLabel>
                  <Select value={tone} onValueChange={(value) => setTone(value as Tone)}>
                    <SelectTrigger id="tone" className="w-full cursor-pointer">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {TONES.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel htmlFor="length">Length</FieldLabel>
                  <Select value={length} onValueChange={(value) => setLength(value as Length)}>
                    <SelectTrigger id="length" className="w-full cursor-pointer">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {LENGTHS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !topic.trim()}
                  className="w-full sm:w-auto cursor-pointer min-h-[44px]"
                >
                  {isGenerating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  {isGenerating ? 'Generating...' : 'Generate email'}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setIsHistoryOpen(true)}
                  className="w-full sm:w-auto cursor-pointer min-h-[44px] md:hidden"
                >
                  <History className="mr-2 h-4 w-4" />
                  Recent emails ({history.length})
                </Button>
              </div>
            </FieldGroup>
          </div>

          <ResultPanel result={result} isGenerating={isGenerating} />
        </div>

        <div className="hidden md:block">
          <HistoryList history={history} isLoading={isLoadingHistory} onSelect={handleSelectHistory} />
        </div>

        <BottomSheet
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          title="Recent Emails"
        >
          <HistoryList history={history} isLoading={isLoadingHistory} onSelect={handleSelectHistory} />
        </BottomSheet>
      </div>
    </FadeIn>
  )
}
