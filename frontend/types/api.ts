export type Plan = 'FREE' | 'PRO' | 'PREMIUM'
export type Tone = 'PROFESSIONAL' | 'CASUAL' | 'FRIENDLY' | 'FORMAL' | 'PERSUASIVE'
export type Length = 'SHORT' | 'MEDIUM' | 'LONG'

export interface User {
  id: string
  email: string
  name: string
  plan: Plan
  createdAt: string
}

export interface Generation {
  id: string
  userId: string
  topic: string
  tone: Tone
  length: Length
  content: string
  createdAt: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
}

export interface RefreshRequest {
  refreshToken: string
}

export interface GenerateRequest {
  topic: string
  tone: Tone
  length: Length
}

export interface UpdateUserRequest {
  name: string
}

export interface UpgradeRequest {
  plan: Plan
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}
