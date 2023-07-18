import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { User } from './users.entity';

@Injectable()
export class AuthService {
	constructor(private readonly usersService: UsersService) {}

	async signup(email: string, password: string): Promise<User> {
		const isEmailInUse: boolean = await this.usersService.isEmailInUse(email);

		if (isEmailInUse) {
			throw new BadRequestException('email is already in use');
		}

		const salt = 10;
		const hashedPassword = await bcrypt.hash(password, salt);

		return await this.usersService.create(email, hashedPassword);
	}

	async signin(email: string, password: string): Promise<User> {
		const [user] = await this.usersService.find(email);

		if (!user) {
			throw new NotFoundException('Incorrect password');
		}

		const salt = 10;
		const hash = await bcrypt.hash(password, salt);

		const isMatch = await bcrypt.compare(password, hash);

		if (!isMatch) {
			throw new BadRequestException('email is already in use');
		}

		return user;
	}
}
