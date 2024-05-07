import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupRequest {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Full Name', example: 'Mohit Fagoria' })
  readonly name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Enter valid email address' })
  @ApiProperty({ description: 'Email', example: 'mohit@gmail.com' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Password', example: 'password' })
  readonly password: string;
}
