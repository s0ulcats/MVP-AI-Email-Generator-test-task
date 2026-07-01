export type Tone = "formal" | "friendly" | "persuasive" | "casual"

export type Length = "short" | "medium" | "long"

export interface GenerateEmailParams {
  topic: string
  tone: Tone
  length: Length
}

export interface GeneratedEmail {
  subject: string
  body: string
}

export interface GenerationRecord {
  id: string
  topic: string
  tone: Tone
  length: Length
  subject: string
  createdAt: string
}

export interface PricingTier {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  cta: string
  highlighted: boolean
}

export interface FaqItem {
  question: string
  answer: string
}
