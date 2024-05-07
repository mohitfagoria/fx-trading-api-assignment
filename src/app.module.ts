import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExchangeRateFetchService } from './exchange-rate/exchange-rate';
import { DataFetcherModule } from './exchange-rate/exchange-rate.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserSchema } from '../models/user.schema';
import { AccountsModule } from './user/user.module';
import { APP_FILTER } from '@nestjs/core';
import { UnauthorizedExceptionFilter } from './authentication/unauthorized.exception';

@Module({
  imports: [
    DataFetcherModule,
    AuthenticationModule,
    AccountsModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forRoot(process.env.MONGO_URI),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRES'),
          },
        };
      },
    }),
    ScheduleModule.forRoot(),
  ],
  providers: [
    AppService,
    ExchangeRateFetchService,
    AuthenticationService,
    {
      provide: APP_FILTER,
      useClass: UnauthorizedExceptionFilter,
    },
  ],
  controllers: [AppController, AuthenticationController],
})
export class AppModule {}
