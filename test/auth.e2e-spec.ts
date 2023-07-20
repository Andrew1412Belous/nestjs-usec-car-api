import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentication System', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('handles a signup request', async () => {
		const user = {
			email: 'testsome@test.com',
			password: 'password',
		};

		return request(app.getHttpServer())
			.post('/auth/signup')
			.send(user)
			.expect(200)
			.then(({ body }) => {
				const { id, email } = body;

				expect(id).toBeDefined();
				expect(email).toEqual(user.email);
			});
	});

	afterAll(async () => {
		await app.close();
	});
	// afterEach(async () => {
	// 	await app.close();
	// });
});
