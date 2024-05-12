import { Module } from '@nestjs/common';
import { AuthModule } from './Auth/Auth.module';
import { MainService } from './Main/Main.service';
import { MainModule } from './Main/Main.module';

@Module({
  imports: [AuthModule, MainModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
