import { IsString, IsEnum, MinLength, MaxLength } from 'class-validator';
import { Tone, Length } from '@prisma/client';

export class GenerateDto {
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  topic: string;

  @IsEnum(Tone)
  tone: Tone;

  @IsEnum(Length)
  length: Length;
}
