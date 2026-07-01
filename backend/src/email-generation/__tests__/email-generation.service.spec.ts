import { Test, TestingModule } from '@nestjs/testing'
import { ForbiddenException } from '@nestjs/common'
import { EmailGenerationService } from '../email-generation.service'
import { PrismaService } from '../../prisma/prisma.service'
import { AIProvider } from '../interfaces/ai-provider.interface'
import { AI_PROVIDER_TOKEN } from '../constants/ai-provider.token'
import { GenerateDto } from '../dto/generate.dto'

describe('EmailGenerationService', () => {
  let service: EmailGenerationService
  let prismaService: jest.Mocked<PrismaService>
  let aiProvider: jest.Mocked<AIProvider>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailGenerationService,
        {
          provide: PrismaService,
          useValue: {
            generation: {
              create: jest.fn() as any,
              findMany: jest.fn() as any,
              count: jest.fn() as any,
            },
            user: {
              findUnique: jest.fn() as any,
            },
          },
        },
        {
          provide: AI_PROVIDER_TOKEN,
          useValue: {
            generate: jest.fn() as any,
          },
        },
      ],
    }).compile()

    service = module.get<EmailGenerationService>(EmailGenerationService)
    prismaService = module.get(PrismaService)
    aiProvider = module.get(AI_PROVIDER_TOKEN)
    jest.clearAllMocks()
  })

  describe('generate', () => {
    it('calls AIProvider.generate() with correct topic, tone, length', async () => {
      const userId = 'user-1'
      const dto: GenerateDto = {
        topic: 'Test topic',
        tone: 'PROFESSIONAL',
        length: 'MEDIUM',
      }

      ;(prismaService.user.findUnique as jest.Mock).mockResolvedValue({
        id: userId,
        plan: 'FREE',
      })
      ;(prismaService.generation.count as jest.Mock).mockResolvedValue(0)
      ;(aiProvider.generate as jest.Mock).mockResolvedValue('Generated email content')
      ;(prismaService.generation.create as jest.Mock).mockResolvedValue({
        id: 'gen-1',
        userId,
        topic: dto.topic,
        tone: dto.tone,
        length: dto.length,
        content: 'Generated email content',
        createdAt: new Date(),
      })

      await service.generate(userId, dto)

      expect(aiProvider.generate).toHaveBeenCalledWith(dto.topic, dto.tone, dto.length)
    })

    it('saves generation record to DB linked to userId', async () => {
      const userId = 'user-1'
      const dto: GenerateDto = {
        topic: 'Test topic',
        tone: 'PROFESSIONAL',
        length: 'MEDIUM',
      }

      ;(prismaService.user.findUnique as jest.Mock).mockResolvedValue({
        id: userId,
        plan: 'FREE',
      })
      ;(prismaService.generation.count as jest.Mock).mockResolvedValue(0)
      ;(aiProvider.generate as jest.Mock).mockResolvedValue('Generated email content')
      ;(prismaService.generation.create as jest.Mock).mockResolvedValue({
        id: 'gen-1',
        userId,
        topic: dto.topic,
        tone: dto.tone,
        length: dto.length,
        content: 'Generated email content',
        createdAt: new Date(),
      })

      await service.generate(userId, dto)

      expect(prismaService.generation.create).toHaveBeenCalledWith({
        data: {
          userId,
          topic: dto.topic,
          tone: dto.tone,
          length: dto.length,
          content: 'Generated email content',
        },
      })
    })

    it('throws ForbiddenException when Free plan user exceeds monthly limit', async () => {
      const userId = 'user-1'
      const dto: GenerateDto = {
        topic: 'Test topic',
        tone: 'PROFESSIONAL',
        length: 'MEDIUM',
      }

      ;(prismaService.user.findUnique as jest.Mock).mockResolvedValue({
        id: userId,
        plan: 'FREE',
      })
      ;(prismaService.generation.count as jest.Mock).mockResolvedValue(11)

      await expect(service.generate(userId, dto)).rejects.toThrow()
    })
  })

  describe('getHistory', () => {
    it('returns only generations belonging to the requesting user', async () => {
      const userId = 'user-1'
      const mockGenerations = [
        {
          id: 'gen-1',
          userId,
          topic: 'Topic 1',
          tone: 'PROFESSIONAL',
          length: 'MEDIUM',
          content: 'Content 1',
          createdAt: new Date(),
        },
      ]

      ;(prismaService.generation.findMany as jest.Mock).mockResolvedValue(mockGenerations)

      const result = await service.getHistory(userId)

      expect(prismaService.generation.findMany).toHaveBeenCalledWith({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      })
      expect(result).toEqual(mockGenerations)
    })

    it('returns results ordered by createdAt descending', async () => {
      const userId = 'user-1'

      ;(prismaService.generation.findMany as jest.Mock).mockResolvedValue([])

      await service.getHistory(userId)

      expect(prismaService.generation.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { createdAt: 'desc' },
        })
      )
    })
  })
})
