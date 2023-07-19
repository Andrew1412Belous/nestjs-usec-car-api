import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './users.entity';

describe('UsersService', () => {
	let service: UsersService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UsersService,
				{
					provide: getRepositoryToken(User),
					useValue: {
						create: ({ email, password }) => {
							return Promise.resolve({
								id: Math.floor(Math.random() * 999),
								email,
								password,
							} as User);
						},
						save: (user: User) => {
							return Promise.resolve(user);
						},
					},
				},
			],
		}).compile();

		service = module.get<UsersService>(UsersService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('Create a new user', async () => {
		const user = await service.create('test@email.com', 'salt.hash');
		expect(user).toBeDefined();
		expect(user.email).toEqual('test@email.com');
	});
});
