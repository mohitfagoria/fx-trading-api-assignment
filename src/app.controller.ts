import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AppService } from './app.service';
import {
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ConversionRequest } from './dto/app/conversion-request.dto';
import { ConversionResponse } from './dto/app/conversion-response.dto';
import { RateResponse } from './dto/app/rate-response.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Endpoint to fetch live FX conversion rates and generate a quote ID.
   * @summary Fetch live FX conversion rates and generate a quote ID.
   * @returns An object containing the quote ID and its expiry time.
   */
  @Get('/fx-rates')
  @UseGuards(AuthGuard()) // Protected route
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Fetches live FX conversion rates and generates a quote ID for reference.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns quote ID and expiry time.',
    type: RateResponse,
  })
  getFXRates(): object {
    return this.appService.getFXRates();
  }

  /**
   * Endpoint to perform FX conversion using the provided quote ID.
   * @summary Perform FX conversion using the provided quote ID.
   * @param body The request body for FX conversion.
   * @param req The request object containing user information.
   * @returns An object containing the result of FX conversion.
   */
  @Post('/fx-conversion')
  @UseGuards(AuthGuard()) // Protected route
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Performs an FX conversion using the provided quote ID and converts the specified amount from one currency to another based on user balance.',
  })
  @ApiBody({
    description: 'Request body for FX conversion',
    type: ConversionRequest,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the result of FX conversion.',
    type: ConversionResponse,
  })
  convertFX(
    @Body()
    body: {
      quoteId: string;
      fromCurrency: string;
      toCurrency: string;
      amount: number;
    },
    @Req() req,
  ): object {
    return this.appService.convertFX(
      body.quoteId,
      body.fromCurrency,
      body.toCurrency,
      body.amount,
      req.user,
    );
  }
}
