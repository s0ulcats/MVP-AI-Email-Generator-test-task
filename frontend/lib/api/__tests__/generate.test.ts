import { generateEmail, getHistory } from '../generate'
import { apiFetch } from '../client'
import type { Generation } from '@/types/api'

jest.mock('../client')

describe('generate', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('generateEmail() calls POST /generate with correct topic, tone, length', async () => {
    const mockGeneration: Generation = {
      id: '1',
      userId: 'user-1',
      topic: 'Follow up with client',
      tone: 'PROFESSIONAL',
      length: 'MEDIUM',
      content: 'Generated email content',
      createdAt: '2024-01-01T00:00:00Z',
    }
    ;(apiFetch as jest.MockedFunction<typeof apiFetch>).mockResolvedValueOnce(mockGeneration)

    const result = await generateEmail({
      topic: 'Follow up with client',
      tone: 'PROFESSIONAL',
      length: 'MEDIUM',
    })

    expect(apiFetch).toHaveBeenCalledWith('/generate', {
      method: 'POST',
      body: JSON.stringify({
        topic: 'Follow up with client',
        tone: 'PROFESSIONAL',
        length: 'MEDIUM',
      }),
    })
    expect(result).toEqual(mockGeneration)
  })

  it('getHistory() calls GET /generate/history and returns array', async () => {
    const mockHistory: Generation[] = [
      {
        id: '1',
        userId: 'user-1',
        topic: 'Email 1',
        tone: 'PROFESSIONAL',
        length: 'SHORT',
        content: 'Content 1',
        createdAt: '2024-01-01T00:00:00Z',
      },
      {
        id: '2',
        userId: 'user-1',
        topic: 'Email 2',
        tone: 'CASUAL',
        length: 'LONG',
        content: 'Content 2',
        createdAt: '2024-01-02T00:00:00Z',
      },
    ]
    ;(apiFetch as jest.MockedFunction<typeof apiFetch>).mockResolvedValueOnce(mockHistory)

    const result = await getHistory(10)

    expect(apiFetch).toHaveBeenCalledWith('/generate/history?limit=10')
    expect(result).toEqual(mockHistory)
  })
})
