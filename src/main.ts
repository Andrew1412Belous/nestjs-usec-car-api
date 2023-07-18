import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import CoolieSession = require('cookie-session');

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.use(
		CoolieSession({
			keys: ['some text'],
		}),
	);

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
		}),
	);

	await app.listen(3000);
}

bootstrap();
