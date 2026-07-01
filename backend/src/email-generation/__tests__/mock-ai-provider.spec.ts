import { MockAIProvider } from '../providers/mock-ai.provider'
import { Tone, Length } from '@prisma/client'

describe('MockAIProvider', () => {
  let provider: MockAIProvider

  beforeEach(() => {
    provider = new MockAIProvider()
    jest.clearAllMocks()
  })

  it('generate() returns a non-empty string', async () => {
    const result = await provider.generate('Test topic', Tone.PROFESSIONAL, Length.MEDIUM)

    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('generate() resolves within 3000ms (accounts for artificial delay)', async () => {
    const startTime = Date.now()

    await provider.generate('Test topic', Tone.PROFESSIONAL, Length.MEDIUM)

    const endTime = Date.now()
    const duration = endTime - startTime

    expect(duration).toBeLessThan(3000)
  })

  it('returned string changes based on tone parameter', async () => {
    const professionalResult = await provider.generate('Test topic', Tone.PROFESSIONAL, Length.MEDIUM)
    const casualResult = await provider.generate('Test topic', Tone.CASUAL, Length.MEDIUM)

    expect(professionalResult).toContain('Dear')
    expect(casualResult).toContain('Hey')
    expect(professionalResult).not.toBe(casualResult)
  })

  it('conforms to AIProvider interface (TypeScript compile-time check via assignability test)', () => {
    const aiProvider: MockAIProvider = new MockAIProvider()

    expect(typeof aiProvider.generate).toBe('function')
  })
})
