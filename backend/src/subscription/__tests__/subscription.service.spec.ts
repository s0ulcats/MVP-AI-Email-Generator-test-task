import { Test, TestingModule } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'
import { SubscriptionService } from '../subscription.service'
import { PrismaService } from '../../prisma/prisma.service'
import { UpgradeDto } from '../dto/upgrade.dto'

describe('SubscriptionService', () => {
  let service: SubscriptionService
  let prismaService: jest.Mocked<PrismaService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn() as any,
              update: jest.fn() as any,
            },
          },
        },
      ],
    }).compile()

    service = module.get<SubscriptionService>(SubscriptionService)
    prismaService = module.get(PrismaService)
    jest.clearAllMocks()
  })

  describe('getSubscription', () => {
    it('returns current user plan', async () => {
      const userId = 'user-1'

      ;(prismaService.user.findUnique as jest.Mock).mockResolvedValue({
        id: userId,
        plan: 'FREE',
      })

      const result = await service.getSubscription(userId)

      expect(result).toHaveProperty('plan')
      expect(result.plan).toBe('FREE')
    })

    it('throws NotFoundException when user not found', async () => {
      const userId = 'nonexistent-user'

      ;(prismaService.user.findUnique as jest.Mock).mockResolvedValue(null)

      await expect(service.getSubscription(userId)).rejects.toThrow(NotFoundException)
    })
  })

  describe('upgradePlan', () => {
    it('updates user.plan in DB', async () => {
      const userId = 'user-1'
      const dto: UpgradeDto = { plan: 'PRO' }

      ;(prismaService.user.update as jest.Mock).mockResolvedValue({
        id: userId,
        plan: dto.plan,
      })

      const result = await service.upgradePlan(userId, dto)

      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { plan: dto.plan },
        select: {
          id: true,
          plan: true,
        },
      })
    })

    it('returns updated plan name', async () => {
      const userId = 'user-1'
      const dto: UpgradeDto = { plan: 'PREMIUM' }

      ;(prismaService.user.update as jest.Mock).mockResolvedValue({
        id: userId,
        plan: dto.plan,
      })

      const result = await service.upgradePlan(userId, dto)

      expect(result.plan).toBe('PREMIUM')
    })
  })
})
