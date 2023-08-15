import { Module } from "@nestjs/common";
// import { LoggerModule } from "./infrastructure/logger/logger.module";
// import { ExceptionsModule } from "./infrastructure/exceptions/exceptions.module";
// import { AccountsModule } from "./modules/Accounts/Accounts.module";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DbConfig } from '../typeormconfig';
import { AccountModule } from './account/account.module'
import { TypeOrmConfigService } from "./shared/typeorm/typeorm.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    // LoggerModule,
    // ExceptionsModule,
    AccountModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor() {
    console.log(DbConfig);
  }
}