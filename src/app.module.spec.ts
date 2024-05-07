import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import store from '../redux/store';

describe('AppService', () => {
  let service: AppService;

  const mockReduxState = {
    data: {
      conversion_rates: {
        'USD/EUR': 0.85,
        'USD/GBP': 0.75,
      },
      expiry_at: Date.now() + 3600000,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);

    store.getState = jest.fn().mockReturnValue(mockReduxState);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getFXRates', () => {
    it('should handle unavailable data in Redux store', () => {
      store.getState = jest.fn().mockReturnValueOnce(null);

      const result = service.getFXRates();

      expect(result).toEqual({
        error: 'Failed to fetch data! Please try after sometime',
      });
    });

    it('should return quoteId and expiry_at if data is available', () => {
      const result = service.getFXRates();

      expect(result).toHaveProperty('quoteId');
      expect(result).toHaveProperty('expiry_at');
    });
  });

  describe('convertFX', () => {
    it('should handle unavailable conversion rates for the quoteId', () => {
      const quoteId = 'invalidQuoteId';

      const result = service.convertFX(quoteId, 'USD', 'EUR', 100, null);

      expect(result).toEqual({
        error:
          'Failed to fetch conversion rates for this quoteId! Please try again',
      });
    });

    it('should handle unavailable conversion rates for provided currencies', () => {
      service['fxRates'].set(
        'validQuoteId',
        new Map([
          ['USD/EUR', 0.85],
          ['USD/GBP', 0.75],
        ]),
      );

      const result = service.convertFX('validQuoteId', 'USD', 'XYZ', 100, null);

      expect(result).toEqual({
        error: 'Conversion rates not available for provided currencies',
      });
    });

    it('should return converted amount and currency if conversion rates are available', () => {
      service['fxRates'].set(
        'validQuoteId',
        new Map([
          ['USD/EUR', 0.85],
          ['USD/GBP', 0.75],
        ]),
      );

      const result = service.convertFX('validQuoteId', 'USD', 'EUR', 100, null);

      expect(result).toEqual({ convertedAmount: 85, currency: 'EUR' });
    });
  });
});
