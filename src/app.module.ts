import { Module } from '@nestjs/common';
import { AuthModule } from './Auth/Auth.module';

@Module({
  imports: [AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
