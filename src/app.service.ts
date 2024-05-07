import { Injectable } from '@nestjs/common';
import store from '../redux/store';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../models/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class AppService {
  private readonly fxRates: Map<string, Map<string, number>> = new Map();

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  getFXRates() {
    const quoteID = this.generateQuoteId();

    const fetchedData = store.getState().data;

    if (!fetchedData) {
      return {
        error: 'Error while fetching data, please try again after some time',
      };
    }

    this.fxRates.set(quoteID, fetchedData.conversion_rates);

    return { quoteId: quoteID, expiry_at: fetchedData.expiry_at };
  }

  async convertFX(
    quoteId: string,
    from_currency: string,
    to_currency: string,
    amount: number,
    user: User,
  ): Promise<object> {
    const rates = this.fxRates.get(quoteId);

    if (!rates) {
      return {
        error:
          'Failed to get data from the provided quoteId, please enter new quoteId',
      };
    }

    try {
      const result = await this.userModel.findById(user._id);
      const balance = result.balances;

      const base: string = 'USD';

      const from = rates[`${base}/${from_currency}`];
      const to = rates[`${base}/${to_currency}`];

      if (!from || !to) {
        return {
          error: 'No conversion rate available',
        };
      }

      const rate = to / from;
      const new_amount = amount * rate;

      if (balance.get(from_currency) < amount) {
        return {
          error: `Insufficient balance.`,
          balance: balance.get(from_currency),
        };
      }

      balance.set(from_currency, balance.get(from_currency) - amount);

      if (balance.has(to_currency)) {
        balance.set(to_currency, balance.get(to_currency) + new_amount);
      } else {
        balance.set(to_currency, new_amount);
      }

      try {
        await this.userModel.findByIdAndUpdate(
          { _id: user._id },
          { $set: { balance: Object.fromEntries(balance) } },
          { new: true },
        );

        return { new_amount: new_amount, currency: to_currency };
      } catch (err) {
        console.log(err);
        return { error: 'Error while converting balance, please try again' };
      }
    } catch (error) {
      return { error: 'Conversion Failed, please try again' };
    }
  }

  private generateQuoteId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
