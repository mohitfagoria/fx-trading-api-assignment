import { ApiProperty } from '@nestjs/swagger';

export class BalanceResponse {
  @ApiProperty({ description: 'User Balance in all currencies' })
  balances: Map<string, number>;
}
