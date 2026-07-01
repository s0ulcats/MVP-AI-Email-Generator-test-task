import type { AIProvider } from "@/lib/ai/provider"
import { MockAIProvider } from "@/lib/ai/mock-provider"
import type { GeneratedEmail, Length, Tone } from "@/types"

const provider: AIProvider = new MockAIProvider()

export async function generateEmail(
  topic: string,
  tone: Tone,
  length: Length,
): Promise<GeneratedEmail> {
  if (!topic.trim()) {
    throw new Error("Please describe what the email should be about.")
  }

  return provider.generateEmail({ topic, tone, length })
}
