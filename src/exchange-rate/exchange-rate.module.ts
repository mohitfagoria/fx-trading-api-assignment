import { Module } from '@nestjs/common';
import { ExchangeRateFetchService } from './exchange-rate';

@Module({
  providers: [ExchangeRateFetchService],
})
export class DataFetcherModule {}
