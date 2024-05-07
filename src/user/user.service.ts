import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../models/user.schema';
import { Model } from 'mongoose';
import { Observable, catchError, from, map } from 'rxjs';
import axios, { AxiosError, AxiosResponse } from 'axios';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async topUpAccount(
    currency: string,
    amount: number,
    user: User,
  ): Promise<object> {
    //topup the balance
    console.log('call 1');
    const processed_rates = await this.fetchData();
    // console.log(data, 'fetchData');
    const rate = processed_rates[`USD/${currency}`];
    const converted_amount = amount / rate;

    if (user.balances.has('USD')) {
      user.balances.set('USD', user.balances.get('USD') + converted_amount);
    } else {
      user.balances.set('USD', converted_amount);
    }

    //update balances in database
    try {
      const result = await this.userModel.findByIdAndUpdate(
        { _id: user._id },
        { $set: { balances: Object.fromEntries(user.balances) } },
        { new: true },
      );

      //console.log(result);
      const balance = result.balances.get('USD') * rate;
      return {
        message: `Balance topup successfull`,
        currecny: 'USD',
        balance: balance,
      };
    } catch (err) {
      console.log(err);
      return { message: 'Error while topup, please try again' };
    }
  }

  async getAccountBalance(user: User): Promise<object> {
    try {
      const foundUser = await this.userModel.findById(user._id);
      console.log(foundUser, 'foundUser');
      const processed_rates = await this.fetchData();
      const balanceInUsd = foundUser.balances.get('USD');
      // eslint-disable-next-line prefer-const
      let res = {};
      for (const key in processed_rates) {
        console.log(processed_rates[key], balanceInUsd);
        res[key.split('/')[1]] = processed_rates[key] * balanceInUsd;
      }
      return { balances: res };
    } catch (err) {
      console.log(err);
      return { balances: new Map<string, number>() };
    }
  }

  private async fetchData(): Promise<{ [key: string]: any }> {
    const base_currency = 'USD';
    const api_url = `https://v6.exchangerate-api.com/v6/b08840ed65a2b44815b28f36/latest/${base_currency}`;

    try {
      const data = await this.makeApiCall(api_url).toPromise();

      const conversionRates = data.conversion_rates;
      const processed_rates: { [key: string]: any } = {};
      Object.entries(conversionRates).forEach(([currencyCode, rate]) => {
        processed_rates[`${base_currency}/${currencyCode}`] = rate;
      });

      return processed_rates;
    } catch (error) {
      this.handleError(error);
      return {}; // Return an empty object if there's an error
    }
  }

  private makeApiCall(endpoint: string): Observable<any> {
    console.log('call 5');
    return from(axios.get(endpoint)).pipe(
      map((response: AxiosResponse) => response.data),
      catchError((error: AxiosError) => {
        throw new Error(`Error: ${error.message}`);
      }),
    );
  }

  private handleError(error: Error) {
    console.log('call 6');
    console.log(error.message);
  }
}
