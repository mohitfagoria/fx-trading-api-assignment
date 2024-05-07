import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'models/user.schema';

@Module({
  imports: [
    AuthenticationModule,
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class AccountsModule {}
