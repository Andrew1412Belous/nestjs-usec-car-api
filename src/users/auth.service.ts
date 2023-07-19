import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
	constructor(private readonly usersService: UsersService) {}

	async signup(email: string, password: string): Promise<User> {
		const isEmailInUse: boolean = await this.usersService.isEmailInUse(email);

		if (isEmailInUse) {
			throw new BadRequestException('email is already in use');
		}

		const salt = randomBytes(8).toString('hex');
		const hash = (await scrypt(password, salt, 32)) as Buffer;
		const result = salt + '.' + hash.toString('hex');

		return await this.usersService.create(email, result);
	}

	async signin(email: string, password: string): Promise<User> {
		const [user] = await this.usersService.find(email);

		if (!user) {
			throw new NotFoundException('Email is already in use');
		}

		const [salt, storedHash] = user.password.split('.');

		const hash = (await scrypt(password, salt, 32)) as Buffer;

		if (storedHash !== hash.toString('hex')) {
			throw new BadRequestException('Incorrect password');
		}

		return user;
	}
}
