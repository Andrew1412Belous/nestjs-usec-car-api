import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { UsersService } from '../users.service';
import { Observable } from 'rxjs';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
	constructor(private readonly usersService: UsersService) {}

	async intercept(context: ExecutionContext, handler: CallHandler): Promise<Observable<any>> {
		const request = context.switchToHttp().getRequest();
		const userId = request.session.userId || {};

		if (userId) {
			request.currentUser = this.usersService.findOne(userId);
		}

		return handler.handle();
	}
}
