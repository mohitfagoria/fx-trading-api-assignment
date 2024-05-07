import { ApiProperty } from '@nestjs/swagger';

export class TopupRequest {
  @ApiProperty({ description: 'Currency', example: 'USD' })
  currency: string;

  @ApiProperty({ description: 'Amount', example: 100 })
  amount: number;
}
