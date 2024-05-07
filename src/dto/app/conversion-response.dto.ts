import { ApiProperty } from '@nestjs/swagger';

export class ConversionResponse {
  @ApiProperty({ description: 'Amount after conversion', example: 90.53 })
  convertedAmount: number;

  @ApiProperty({ description: 'Currency of new amount', example: 'EUR' })
  currency: string;
}
