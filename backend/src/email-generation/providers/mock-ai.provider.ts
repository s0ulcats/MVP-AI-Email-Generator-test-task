import { Injectable } from '@nestjs/common';
import { AIProvider } from '../interfaces/ai-provider.interface';
import { Tone, Length } from '@prisma/client';

@Injectable()
export class MockAIProvider implements AIProvider {
  async generate(topic: string, tone: Tone, length: Length): Promise<string> {
    await this.simulateDelay();

    const templates = this.getTemplates(tone, length);
    const template = templates[Math.floor(Math.random() * templates.length)];

    return template.replace('{{topic}}', topic);
  }

  private async simulateDelay(): Promise<void> {
    const delay = 1000 + Math.random() * 1000;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  private getTemplates(tone: Tone, length: Length): string[] {
    const tonePrefixes: Record<Tone, string> = {
      [Tone.PROFESSIONAL]: 'Dear',
      [Tone.CASUAL]: 'Hey',
      [Tone.FRIENDLY]: 'Hi there',
      [Tone.FORMAL]: 'Dear',
      [Tone.PERSUASIVE]: 'Hello',
    };

    const toneClosings: Record<Tone, string> = {
      [Tone.PROFESSIONAL]: 'Best regards',
      [Tone.CASUAL]: 'Cheers',
      [Tone.FRIENDLY]: 'Warmly',
      [Tone.FORMAL]: 'Sincerely',
      [Tone.PERSUASIVE]: 'Looking forward to hearing from you',
    };

    const lengthMultipliers: Record<Length, number> = {
      [Length.SHORT]: 1,
      [Length.MEDIUM]: 2,
      [Length.LONG]: 3,
    };

    const prefix = tonePrefixes[tone];
    const closing = toneClosings[tone];
    const multiplier = lengthMultipliers[length];

    const baseTemplates = [
      `${prefix},\n\nI wanted to reach out regarding {{topic}}. I believe this is an important matter that deserves our attention.\n\n${closing}.`,
      `${prefix},\n\nI hope this email finds you well. I'm writing to discuss {{topic}} and explore potential opportunities.\n\n${closing}.`,
      `${prefix},\n\nFollowing up on our previous conversation about {{topic}}. I wanted to provide some additional context and next steps.\n\n${closing}.`,
    ];

    const extendedTemplates = baseTemplates.map((template) => {
      const additionalContent = '\n\nPlease let me know your thoughts on this matter. I\'m available for a call at your convenience to discuss further details.';
      return template + additionalContent.repeat(multiplier - 1);
    });

    return extendedTemplates;
  }
}
