import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { LoginRequest } from '../dto/authentication/login.dto';
import { SignupRequest } from '../dto/authentication/signup.dto';
import { SignupLoginResponse } from '../dto/authentication/response.dto';

@Controller('auth')
export class AuthenticationController {
  constructor(private authService: AuthenticationService) {}

  /**
   * Endpoint for user signup, providing a JWT Bearer token upon successful registration.
   * @summary Perform user signup and issue a JWT Bearer token.
   * @param signUpDto The request body for user signup.
   * @returns A promise resolving to an object containing the JWT Bearer token.
   */
  @Post('/signup')
  @ApiOperation({
    summary: 'Perform user signup and issue a JWT Bearer token',
  })
  @ApiBody({ description: 'Request body for user signup', type: SignupRequest })
  @ApiResponse({
    status: 200,
    description: 'Returns a JWT Bearer token upon successful signup',
    type: SignupLoginResponse,
  })
  async signUp(@Body() signUpDto: SignupRequest): Promise<object> {
    return await this.authService.signUp(signUpDto);
  }

  /**
   * Endpoint for user login, providing a JWT Bearer token upon successful authentication.
   * @summary Perform user login and issue a JWT Bearer token.
   * @param loginDto The request body for user login.
   * @returns A promise resolving to an object containing the JWT Bearer token.
   */
  @Post('/login')
  @ApiOperation({
    summary: 'Perform user login and issue a JWT Bearer token',
  })
  @ApiBody({ description: 'Request body for user login', type: LoginRequest })
  @ApiResponse({
    status: 200,
    description: 'Returns a JWT Bearer token upon successful login',
    type: SignupLoginResponse,
  })
  async login(@Body() loginDto: LoginRequest): Promise<object> {
    return await this.authService.login(loginDto);
  }
}
