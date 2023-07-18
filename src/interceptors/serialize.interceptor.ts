import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClassConstructor, plainToClass } from 'class-transformer';

export class SerializeInterceptor<T> implements NestInterceptor {
	constructor(private readonly dto: ClassConstructor<T>) {}

	intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
		return handler.handle().pipe(
			map((data: T) => {
				return plainToClass(this.dto, data, {
					excludeExtraneousValues: true,
				});
			}),
		);
	}
}
