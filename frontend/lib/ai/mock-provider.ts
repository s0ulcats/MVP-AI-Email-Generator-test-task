import type { AIProvider } from "@/lib/ai/provider"
import type {
  GenerateEmailParams,
  GeneratedEmail,
  Length,
  Tone,
} from "@/types"

const greetings: Record<Tone, string> = {
  formal: "Dear [Recipient],",
  friendly: "Hi there,",
  persuasive: "Hello,",
  casual: "Hey,",
}

const closings: Record<Tone, string> = {
  formal: "Kind regards,\n[Your Name]",
  friendly: "All the best,\n[Your Name]",
  persuasive: "Looking forward to hearing from you,\n[Your Name]",
  casual: "Cheers,\n[Your Name]",
}

const openers: Record<Tone, (topic: string) => string> = {
  formal: (topic) =>
    `I hope this message finds you well. I am writing to discuss ${topic}, as I believe it warrants your considered attention.`,
  friendly: (topic) =>
    `I wanted to reach out about ${topic} — I think it's worth a quick conversation between us.`,
  persuasive: (topic) =>
    `I'll keep this brief: ${topic} represents an opportunity I'm confident you won't want to miss.`,
  casual: (topic) =>
    `Just a quick note about ${topic}. Wanted to get your thoughts whenever you have a sec.`,
}

const bodies: Record<Tone, (topic: string) => string[]> = {
  formal: (topic) => [
    `Having reviewed the relevant details surrounding ${topic}, I am confident there is a clear path forward that aligns with our shared objectives.`,
    `I would welcome the opportunity to walk you through the specifics and address any questions you may have regarding ${topic}.`,
    `Please let me know a time that suits your schedule, and I will ensure the necessary materials are prepared in advance.`,
  ],
  friendly: (topic) => [
    `From what I've seen, ${topic} could genuinely make things easier for everyone involved, and I'd love to get your take.`,
    `No pressure at all — I just figured it made sense to loop you in early so we're on the same page.`,
    `Let me know if you'd like to hop on a quick call this week to chat it through.`,
  ],
  persuasive: (topic) => [
    `Here's why it matters: ${topic} directly addresses the challenges we've been trying to solve, and the timing has never been better.`,
    `Acting now puts us ahead of the curve, while waiting risks leaving real value on the table.`,
    `I'd love just fifteen minutes to show you exactly how this works — I'm confident you'll see the upside immediately.`,
  ],
  casual: (topic) => [
    `Basically, ${topic} seems like a solid move and I didn't want it to slip through the cracks.`,
    `Nothing urgent, but figured I'd flag it while it was top of mind.`,
    `Ping me whenever and we can figure out the next steps together.`,
  ],
}

const lengthParagraphs: Record<Length, number> = {
  short: 1,
  medium: 2,
  long: 3,
}

const subjects: Record<Tone, (topic: string) => string> = {
  formal: (topic) => `Regarding ${capitalize(topic)}`,
  friendly: (topic) => `Quick thought on ${topic}`,
  persuasive: (topic) => `An opportunity worth your time: ${topic}`,
  casual: (topic) => `${capitalize(topic)} — quick one`,
}

function capitalize(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return trimmed
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export class MockAIProvider implements AIProvider {
  async generateEmail({
    topic,
    tone,
    length,
  }: GenerateEmailParams): Promise<GeneratedEmail> {
    await delay(1000 + Math.random() * 1000)

    const normalizedTopic = topic.trim().toLowerCase()
    const paragraphCount = lengthParagraphs[length]
    const selectedBodies = bodies[tone](normalizedTopic).slice(0, paragraphCount)

    const body = [
      greetings[tone],
      "",
      openers[tone](normalizedTopic),
      "",
      ...interleave(selectedBodies),
      closings[tone],
    ].join("\n")

    return {
      subject: subjects[tone](normalizedTopic),
      body,
    }
  }
}

function interleave(paragraphs: string[]) {
  const result: string[] = []
  for (const paragraph of paragraphs) {
    result.push(paragraph, "")
  }
  return result
}
