import { HttpExceptionFilter } from '../filters/http-exception.filter'
import { HttpException, HttpStatus } from '@nestjs/common'
import { ArgumentsHost } from '@nestjs/common'
import { Response } from 'express'

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter
  let mockResponse: jest.Mocked<Response>
  let mockArgumentsHost: ArgumentsHost

  beforeEach(() => {
    filter = new HttpExceptionFilter()
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as jest.Mocked<Response>

    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(mockResponse),
      }),
    } as unknown as ArgumentsHost

    jest.clearAllMocks()
  })

  it('returns correct HTTP status and JSON error shape for HttpException', () => {
    const exception = new HttpException('Not found', HttpStatus.NOT_FOUND)

    filter.catch(exception, mockArgumentsHost)

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND)
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Not found',
        timestamp: expect.any(String),
      })
    )
  })

  it('returns 500 with generic message for unexpected errors (does not leak stack trace)', () => {
    const exception = new Error('Unexpected error')

    filter.catch(exception, mockArgumentsHost)

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR)
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        timestamp: expect.any(String),
      })
    )
  })

  it('never returns undefined or empty body', () => {
    const exception = new HttpException('Bad request', HttpStatus.BAD_REQUEST)

    filter.catch(exception, mockArgumentsHost)

    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: expect.any(Number),
        message: expect.any(String),
        timestamp: expect.any(String),
      })
    )
  })
})
