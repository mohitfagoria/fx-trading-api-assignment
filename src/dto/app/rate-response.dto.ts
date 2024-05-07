import { ApiProperty } from '@nestjs/swagger';

export class RateResponse {
  @ApiProperty({ description: 'Quote Id', example: 'sdcE@3dc' })
  quoteId: string;

  @ApiProperty({
    description: 'Expiry time of the quote id',
    example: '01:46:31 GMT+0530 (India Standard Time)',
  })
  expiry_at: string;
}
