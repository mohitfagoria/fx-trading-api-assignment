import { ApiProperty } from '@nestjs/swagger';

export class ConversionRequest {
  @ApiProperty({
    description: 'QuoteId',
    example: 'cdf$32wd',
  })
  quoteId: string;

  @ApiProperty({ description: 'From Currency', example: 'USD' })
  fromCurrency: string;

  @ApiProperty({ description: 'To Currency', example: 'EUR' })
  toCurrency: string;

  @ApiProperty({ description: 'Amount', example: 100 })
  amount: number;
}
