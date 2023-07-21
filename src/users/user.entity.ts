import {
	AfterInsert,
	AfterUpdate,
	AfterRemove,
	Entity,
	Column,
	PrimaryGeneratedColumn,
	Index,
	OneToMany,
} from 'typeorm';
import { Report } from '../reports/report.entity';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	@Index()
	email: string;

	@Column()
	password: string;

	@Column({ default: true })
	admin: boolean;

	@OneToMany(() => Report, (report) => report.user)
	reports: Report[];

	@AfterInsert()
	logInsert() {
		console.log('Inserted with id ' + this.id);
	}

	@AfterUpdate()
	logUpdate() {
		console.log('Updated with id ' + this.id);
	}

	@AfterRemove()
	logRemove() {
		console.log('Removed with id ' + this.id);
	}
}
