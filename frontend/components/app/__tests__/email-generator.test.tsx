import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EmailGenerator } from '../email-generator'
import { generateEmail, getHistory } from '@/lib/api/generate'
import { toast } from 'sonner'

jest.mock('@/lib/api/generate')
jest.mock('sonner')

describe('EmailGenerator', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    ;(getHistory as jest.MockedFunction<typeof getHistory>).mockResolvedValue([])
  })

  it('renders textarea, tone select, length select, and Generate button', async () => {
    await act(async () => {
      render(<EmailGenerator />)
    })

    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByLabelText(/Tone/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Length/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Generate email/i })).toBeInTheDocument()
  })

  it('Generate button is disabled when textarea is empty', async () => {
    await act(async () => {
      render(<EmailGenerator />)
    })

    const generateButton = screen.getByRole('button', { name: /Generate email/i })
    expect(generateButton).toBeDisabled()
  })

  it('shows spinner on Generate button while request is in flight', async () => {
    ;(generateEmail as jest.MockedFunction<typeof generateEmail>).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({
        id: '1',
        userId: 'user-1',
        topic: 'Test',
        tone: 'PROFESSIONAL',
        length: 'MEDIUM',
        content: 'Generated content',
        createdAt: '2024-01-01T00:00:00Z',
      }), 100))
    )

    await act(async () => {
      render(<EmailGenerator />)
    })

    const textarea = screen.getByRole('textbox')
    await userEvent.type(textarea, 'Test topic')

    const generateButton = screen.getByRole('button', { name: /Generate email/i })
    await userEvent.click(generateButton)

    expect(screen.getByRole('button', { name: /Generating/i })).toBeInTheDocument()
  })

  it('calls generateEmail() with correct arguments on submit', async () => {
    ;(generateEmail as jest.MockedFunction<typeof generateEmail>).mockResolvedValue({
      id: '1',
      userId: 'user-1',
      topic: 'Test topic',
      tone: 'PROFESSIONAL',
      length: 'MEDIUM',
      content: 'Generated content',
      createdAt: '2024-01-01T00:00:00Z',
    })

    await act(async () => {
      render(<EmailGenerator />)
    })

    const textarea = screen.getByRole('textbox')
    await userEvent.type(textarea, 'Test topic')

    const generateButton = screen.getByRole('button', { name: /Generate email/i })
    await userEvent.click(generateButton)

    await waitFor(() => {
      expect(generateEmail).toHaveBeenCalledWith({
        topic: 'Test topic',
        tone: 'PROFESSIONAL',
        length: 'MEDIUM',
      })
    })
  })

  it('displays generated email result after successful generation', async () => {
    const mockGeneration = {
      id: '1',
      userId: 'user-1',
      topic: 'Test topic',
      tone: 'PROFESSIONAL',
      length: 'MEDIUM',
      content: 'This is the generated email content',
      createdAt: '2024-01-01T00:00:00Z',
    }
    ;(generateEmail as jest.MockedFunction<typeof generateEmail>).mockResolvedValue(mockGeneration)

    await act(async () => {
      render(<EmailGenerator />)
    })

    const textarea = screen.getByRole('textbox')
    await userEvent.type(textarea, 'Test topic')

    const generateButton = screen.getByRole('button', { name: /Generate email/i })
    await userEvent.click(generateButton)

    await waitFor(() => {
      expect(screen.getByText('This is the generated email content')).toBeInTheDocument()
    })
  })

  it('shows sonner toast on generation error', async () => {
    ;(generateEmail as jest.MockedFunction<typeof generateEmail>).mockRejectedValue(
      new Error('Generation failed')
    )

    await act(async () => {
      render(<EmailGenerator />)
    })

    const textarea = screen.getByRole('textbox')
    await userEvent.type(textarea, 'Test topic')

    const generateButton = screen.getByRole('button', { name: /Generate email/i })
    await userEvent.click(generateButton)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Generation failed', expect.any(Object))
    })
  })

  it('Copy button copies result text to clipboard', async () => {
    const mockGeneration = {
      id: '1',
      userId: 'user-1',
      topic: 'Test topic',
      tone: 'PROFESSIONAL',
      length: 'MEDIUM',
      content: 'Test email content',
      createdAt: '2024-01-01T00:00:00Z',
    }
    ;(generateEmail as jest.MockedFunction<typeof generateEmail>).mockResolvedValue(mockGeneration)

    const mockWriteText = jest.fn().mockResolvedValue(undefined)
    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
      },
    })

    await act(async () => {
      render(<EmailGenerator />)
    })

    const textarea = screen.getByRole('textbox')
    await userEvent.type(textarea, 'Test topic')

    const generateButton = screen.getByRole('button', { name: /Generate email/i })
    await userEvent.click(generateButton)

    await waitFor(() => {
      expect(screen.getByText('Test email content')).toBeInTheDocument()
    })

    const copyButton = screen.getByRole('button', { name: /Copy/i })
    await userEvent.click(copyButton)

    expect(mockWriteText).toHaveBeenCalledWith('Test email content')
  })

  it('character and word count updates when result is displayed', async () => {
    const mockGeneration = {
      id: '1',
      userId: 'user-1',
      topic: 'Test topic',
      tone: 'PROFESSIONAL',
      length: 'MEDIUM',
      content: 'This is a test email',
      createdAt: '2024-01-01T00:00:00Z',
    }
    ;(generateEmail as jest.MockedFunction<typeof generateEmail>).mockResolvedValue(mockGeneration)

    await act(async () => {
      render(<EmailGenerator />)
    })

    const textarea = screen.getByRole('textbox')
    await userEvent.type(textarea, 'Test topic')

    const generateButton = screen.getByRole('button', { name: /Generate email/i })
    await userEvent.click(generateButton)

    await waitFor(() => {
      expect(screen.getByText(/This is a test email/)).toBeInTheDocument()
    })

    expect(screen.getByText(/5 words/)).toBeInTheDocument()
    expect(screen.getByText(/characters/)).toBeInTheDocument()
  })
})
