import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReportsModule } from './reports/reports.module';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
import { APP_PIPE } from '@nestjs/core';

import CookieSession = require('cookie-session');
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from 'rxjs';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const dbConfig = require('../ormconfig.js');

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `.env.${process.env.NODE_ENV}`,
		}),
		TypeOrmModule.forRoot(dbConfig),
		// TypeOrmModule.forRootAsync({
		// 	inject: [ConfigService],
		// 	useFactory: (config: ConfigService) => {
		// 		return {
		// 			type: 'sqlite',
		// 			database: config.get<string>('DB_NAME'),
		// 			entities: [User, Report],
		// 			synchronize: true,
		// 		};
		// 	},
		// }),
		ReportsModule,
		UsersModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_PIPE,
			useValue: new ValidationPipe({
				transform: true,
				transformOptions: {
					enableImplicitConversion: true,
				},
				whitelist: true,
				stopAtFirstError: true,
			}),
		},
	],
})
export class AppModule {
	constructor(private readonly configService: ConfigService) {}

	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(
				CookieSession({
					keys: [this.configService.get('COOKIE_KEY')],
				}),
			)
			.forRoutes('*');
	}
}
