import { Test, TestingModule } from '@nestjs/testing'
import { UnauthorizedException, ConflictException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { AuthService } from '../auth.service'
import { PrismaService } from '../../prisma/prisma.service'
import { RegisterDto } from '../dto/register.dto'
import { LoginDto } from '../dto/login.dto'
import { RefreshDto } from '../dto/refresh.dto'

describe('AuthService', () => {
  let service: AuthService
  let prismaService: jest.Mocked<PrismaService>
  let jwtService: jest.Mocked<JwtService>
  let bcryptHashSpy: jest.SpyInstance
  let bcryptCompareSpy: jest.SpyInstance

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn() as any,
              create: jest.fn() as any,
            },
            refreshToken: {
              create: jest.fn() as any,
              delete: jest.fn() as any,
              deleteMany: jest.fn() as any,
              findUnique: jest.fn() as any,
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn() as any,
          },
        },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
    prismaService = module.get(PrismaService)
    jwtService = module.get(JwtService)
    bcryptHashSpy = jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve('hashed-password'))
    bcryptCompareSpy = jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true))
    jest.clearAllMocks()
  })

  afterEach(() => {
    bcryptHashSpy.mockRestore()
    bcryptCompareSpy.mockRestore()
  })

  describe('register', () => {
    it('hashes password with bcrypt before saving', async () => {
      const dto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      }

      ;(prismaService.user.findUnique as jest.Mock).mockResolvedValue(null)
      ;(prismaService.user.create as jest.Mock).mockResolvedValue({
        id: '1',
        email: dto.email,
        name: dto.name,
        passwordHash: 'hashed-password',
        plan: 'FREE',
        createdAt: new Date(),
      })
      ;(jwtService.signAsync as jest.Mock).mockResolvedValue('access-token')

      await service.register(dto)

      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10)
    })

    it('throws ConflictException if email already exists', async () => {
      const dto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      }

      ;(prismaService.user.findUnique as jest.Mock).mockResolvedValue({
        id: '1',
        email: dto.email,
        name: 'Test User',
        passwordHash: 'hashed-password',
        plan: 'FREE',
        createdAt: new Date(),
      })

      await expect(service.register(dto)).rejects.toThrow(ConflictException)
    })
  })

  describe('login', () => {
    it('returns access and refresh tokens on valid credentials', async () => {
      const dto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      }

      ;(prismaService.user.findUnique as jest.Mock).mockResolvedValue({
        id: '1',
        email: dto.email,
        name: 'Test User',
        passwordHash: 'hashed-password',
        plan: 'FREE',
        createdAt: new Date(),
      })
      ;(jwtService.signAsync as jest.Mock).mockResolvedValue('token')

      const result = await service.login(dto)

      expect(result).toHaveProperty('accessToken')
      expect(result).toHaveProperty('refreshToken')
    })

    it('throws UnauthorizedException on wrong password', async () => {
      const dto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      }

      ;(prismaService.user.findUnique as jest.Mock).mockResolvedValue({
        id: '1',
        email: dto.email,
        name: 'Test User',
        passwordHash: 'hashed-password',
        plan: 'FREE',
        createdAt: new Date(),
      })
      bcryptCompareSpy.mockImplementationOnce(() => Promise.resolve(false))

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException)
    })

    it('throws UnauthorizedException if user not found', async () => {
      const dto: LoginDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      }

      ;(prismaService.user.findUnique as jest.Mock).mockResolvedValue(null)

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException)
    })
  })

  describe('refresh', () => {
    it('issues new access token for valid refresh token', async () => {
      const dto: RefreshDto = { refreshToken: 'valid-refresh-token' }

      ;(prismaService.refreshToken.findUnique as jest.Mock).mockResolvedValue({
        id: '1',
        token: dto.refreshToken,
        userId: 'user-1',
        expiresAt: new Date(Date.now() + 86400000),
        user: {
          id: 'user-1',
          email: 'test@example.com',
          name: 'Test User',
          passwordHash: 'hashed-password',
          plan: 'FREE',
          createdAt: new Date(),
        },
      })
      ;(jwtService.signAsync as jest.Mock).mockResolvedValue('new-access-token')

      const result = await service.refresh(dto)

      expect(result).toHaveProperty('accessToken')
      expect(result).toHaveProperty('refreshToken')
    })

    it('throws UnauthorizedException for invalid refresh token', async () => {
      const dto: RefreshDto = { refreshToken: 'invalid-token' }

      ;(prismaService.refreshToken.findUnique as jest.Mock).mockResolvedValue(null)

      await expect(service.refresh(dto)).rejects.toThrow(UnauthorizedException)
    })
  })

  describe('logout', () => {
    it('invalidates the refresh token', async () => {
      const refreshToken = 'valid-refresh-token'

      ;(prismaService.refreshToken.deleteMany as jest.Mock).mockResolvedValue({ count: 1 })

      await service.logout(refreshToken)

      expect(prismaService.refreshToken.deleteMany).toHaveBeenCalledWith({
        where: { token: refreshToken },
      })
    })
  })
})
