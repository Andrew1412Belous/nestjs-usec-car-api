import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
	constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

	create(email: string, password: string) {
		const user = this.repo.create({ email, password });

		return this.repo.save(user);
	}

	findOne(id: number) {
		if (!id) {
			throw new BadRequestException('Invalid id');
		}

		return this.repo.findOneBy({ id });
	}

	find(email: string) {
		return this.repo.find({ where: { email } });
	}

	async update(id: number, attrs: Partial<User>) {
		const user = await this.findOne(id);

		if (!user) {
			throw new NotFoundException('User not found');
		}

		Object.assign(user, attrs);

		return this.repo.save(user);
	}

	async remove(id: number) {
		const user = await this.findOne(id);

		if (!user) {
			throw new NotFoundException('User not found');
		}

		return this.repo.remove(user);
	}

	async isEmailInUse(email: string): Promise<boolean> {
		const count: number = await this.repo
			.createQueryBuilder('user')
			.select(['id'])
			.where('user.email = :email', { email: email })
			.limit(1)
			.getCount();

		return count >= 1;
	}
}
