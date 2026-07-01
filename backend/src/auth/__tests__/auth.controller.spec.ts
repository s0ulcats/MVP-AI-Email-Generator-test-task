import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from '../auth.controller'
import { AuthService } from '../auth.service'
import { RegisterDto } from '../dto/register.dto'
import { LoginDto } from '../dto/login.dto'
import { RefreshDto } from '../dto/refresh.dto'

describe('AuthController', () => {
  let controller: AuthController
  let authService: jest.Mocked<AuthService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
            logout: jest.fn(),
            refresh: jest.fn(),
          },
        },
      ],
    }).compile()

    controller = module.get<AuthController>(AuthController)
    authService = module.get(AuthService)
    jest.clearAllMocks()
  })

  it('POST /auth/register returns 201 with user data (no passwordHash in response)', async () => {
    const dto: RegisterDto = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    }

    const mockResponse = {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    }
    authService.register.mockResolvedValue(mockResponse)

    const result = await controller.register(dto)

    expect(result).toEqual(mockResponse)
    expect(authService.register).toHaveBeenCalledWith(dto)
  })

  it('POST /auth/login returns 200 with tokens', async () => {
    const dto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    }

    const mockResponse = {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    }
    authService.login.mockResolvedValue(mockResponse)

    const result = await controller.login(dto)

    expect(result).toEqual(mockResponse)
    expect(authService.login).toHaveBeenCalledWith(dto)
  })

  it('POST /auth/logout returns 200', async () => {
    const dto: RefreshDto = { refreshToken: 'refresh-token' }

    authService.logout.mockResolvedValue(undefined)

    await controller.logout(dto)

    expect(authService.logout).toHaveBeenCalledWith(dto.refreshToken)
  })

  it('POST /auth/refresh returns 200 with new access token', async () => {
    const dto: RefreshDto = { refreshToken: 'refresh-token' }

    const mockResponse = {
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    }
    authService.refresh.mockResolvedValue(mockResponse)

    const result = await controller.refresh(dto)

    expect(result).toEqual(mockResponse)
    expect(authService.refresh).toHaveBeenCalledWith(dto)
  })
})
