import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TopupRequest } from '../dto/user/topup-request.dto';
import { TopupResponse } from '../dto/user/topup-response.dto';
import { BalanceResponse } from '../dto/user/balance-response.dto';

@Controller('accounts')
export class UserController {
  constructor(private readonly accountService: UserService) {}

  /**
   * Endpoint to top up user account with a specified amount in a given currency.
   * @summary Allow users to top up their account with a specified amount in a given currency.
   * @param body The request body containing currency and amount to top up.
   * @param req The request object for authentication.
   * @returns A promise resolving to an object containing updated balance after top-up.
   */
  @Post('/topup')
  @UseGuards(AuthGuard()) // Protected route
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Allows users to top up their account with a specified amount in a given currency with bearer token authentication.',
  })
  @ApiBody({
    description: 'Amount to top-up in a given currency.',
    type: TopupRequest,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns updated balance after top-up.',
    type: TopupResponse,
  })
  async topUpAccount(
    @Body() body: { currency: string; amount: number },
    @Req() req,
  ): Promise<object> {
    return await this.accountService.topUpAccount(
      body.currency,
      body.amount,
      req.user,
    );
  }

  /**
   * Endpoint to retrieve balances in all currencies for the user account.
   * @summary Retrieve balances in all currencies for the user account.
   * @param req The request object for authentication.
   * @returns A promise resolving to an object containing balances in all currencies.
   */
  @Get('/balance')
  @UseGuards(AuthGuard()) // Protected route
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Retrieves the balances in all currencies for the user account with bearer token authentication.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns balances in all currencies.',
    type: BalanceResponse,
  })
  async getAccountBalance(@Req() req): Promise<object> {
    return await this.accountService.getAccountBalance(req.user);
  }
}
