import { ApiProperty } from '@nestjs/swagger';

export class TopupResponse {
  @ApiProperty({
    description: 'Success Message',
    example: 'Topup Successful',
  })
  message: string;

  @ApiProperty({
    description: 'All the balance is converted to USD',
    example: 'USD',
  })
  currency: string;

  @ApiProperty({
    description: 'Current balance after topup',
    example: 20,
  })
  balance: number;
}
