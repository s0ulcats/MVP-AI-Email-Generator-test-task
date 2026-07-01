import type { GenerateEmailParams, GeneratedEmail } from "@/types"

export interface AIProvider {
  generateEmail(params: GenerateEmailParams): Promise<GeneratedEmail>
}
