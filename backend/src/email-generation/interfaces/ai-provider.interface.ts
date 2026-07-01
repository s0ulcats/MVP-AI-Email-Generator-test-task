import { Tone, Length } from '@prisma/client';

export interface AIProvider {
  generate(topic: string, tone: Tone, length: Length): Promise<string>;
}
