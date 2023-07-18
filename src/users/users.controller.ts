import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	Patch,
	Post,
	Query,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from './auth.service';
import { UserDto } from './dto/user.dto';
import { Serialize } from '../decorators/serialize.decorator';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
	constructor(
		private readonly usersService: UsersService,
		private readonly authService: AuthService,
	) {}

	@Post('/signup')
	@HttpCode(200)
	async createUser(@Body() body: CreateUserDto) {
		return await this.authService.signup(body.email, body.password);
	}

	@Post('/signin')
	@HttpCode(200)
	async signInUser(@Body() body: CreateUserDto) {
		return await this.authService.signin(body.email, body.password);
	}

	@Get('/:id')
	async findUser(@Param('id') id: string) {
		const user = await this.usersService.findOne(parseInt(id));

		if (!user) {
			throw new NotFoundException('User not found');
		}

		return user;
	}

	@Get()
	findAllUsers(@Query('email') email: string) {
		return this.usersService.find(email);
	}

	@Delete('/:id')
	removeUser(@Param('id') id: string) {
		return this.usersService.remove(parseInt(id));
	}

	@Patch('/:id')
	updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
		return this.usersService.update(parseInt(id), body);
	}
}
