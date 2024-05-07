import { ApiProperty } from '@nestjs/swagger';

export class SignupLoginResponse {
  @ApiProperty({
    description: 'JWT Token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ij...',
  })
  token: string;
}
