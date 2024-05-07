import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../models/user.schema';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignupRequest } from '../dto/authentication/signup.dto';
import { LoginRequest } from '../dto/authentication/login.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectModel(User.name)
    private user_model: Model<User>,
    private jwt_service: JwtService,
  ) {}

  async signUp(signup_request: SignupRequest): Promise<object> {
    const { name, email, password } = signup_request;

    const hashed_password = await bcrypt.hash(password, 10);

    try {
      const existingUser = await this.user_model.findOne({ email });
      if (existingUser) {
        return { message: 'This email is already registered. Please log in.' };
      }

      const newUser = await this.user_model.create({
        name,
        email,
        password: hashed_password,
        balances: {},
      });

      const token = this.jwt_service.sign({ id: newUser._id });

      return { token: token };
    } catch (error) {
      return { error: 'Failed to create user account. Please try again.' };
    }
  }

  async login(login_request: LoginRequest): Promise<object> {
    const { email, password } = login_request;

    try {
      const user = await this.user_model.findOne({ email });

      if (!user) {
        throw new UnauthorizedException('Invalid email or password.');
      }

      const password_valid = await bcrypt.compare(password, user.password);

      if (!password_valid) {
        throw new UnauthorizedException('Invalid email or password.');
      }

      const token = this.jwt_service.sign({ id: user._id });

      return { token: token };
    } catch (error) {
      throw new UnauthorizedException(
        'Failed to authenticate. Please try again.',
      );
    }
  }
}
