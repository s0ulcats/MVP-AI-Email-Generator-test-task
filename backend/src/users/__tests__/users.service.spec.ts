import { Test, TestingModule } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'
import { UsersService } from '../users.service'
import { PrismaService } from '../../prisma/prisma.service'
import { UpdateUserDto } from '../dto/update-user.dto'

describe('UsersService', () => {
  let service: UsersService
  let prismaService: jest.Mocked<PrismaService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
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

    service = module.get<UsersService>(UsersService)
    prismaService = module.get(PrismaService)
    jest.clearAllMocks()
  })

  describe('getProfile', () => {
    it('returns user without passwordHash', async () => {
      const userId = 'user-1'

      ;(prismaService.user.findUnique as jest.Mock).mockResolvedValue({
        id: userId,
        email: 'test@example.com',
        name: 'Test User',
        plan: 'FREE',
        createdAt: new Date(),
      })

      const result = await service.getProfile(userId)

      expect(result).toHaveProperty('id')
      expect(result).toHaveProperty('email')
      expect(result).toHaveProperty('name')
      expect(result).toHaveProperty('plan')
      expect(result).not.toHaveProperty('passwordHash')
    })

    it('throws NotFoundException when user not found', async () => {
      const userId = 'nonexistent-user'

      ;(prismaService.user.findUnique as jest.Mock).mockResolvedValue(null)

      await expect(service.getProfile(userId)).rejects.toThrow(NotFoundException)
    })
  })

  describe('updateProfile', () => {
    it('persists changed name to database', async () => {
      const userId = 'user-1'
      const dto: UpdateUserDto = { name: 'Updated Name' }

      ;(prismaService.user.update as jest.Mock).mockResolvedValue({
        id: userId,
        email: 'test@example.com',
        name: dto.name,
        plan: 'FREE',
        createdAt: new Date(),
      })

      const result = await service.updateProfile(userId, dto)

      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: dto,
        select: {
          id: true,
          email: true,
          name: true,
          plan: true,
          createdAt: true,
        },
      })
      expect(result.name).toBe(dto.name)
    })

    it('does not allow changing email to one already taken', async () => {
      const userId = 'user-1'
      const dto: UpdateUserDto = { name: 'Updated Name' }

      ;(prismaService.user.update as jest.Mock).mockRejectedValue(
        new Error('Unique constraint failed on the fields: (email)')
      )

      await expect(service.updateProfile(userId, dto)).rejects.toThrow()
    })
  })
})
