import { Controller, Post, Body, UseGuards, Patch, Param, Get, Query } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { Serialize } from '../decorators/serialize.decorator';
import { ReportDto } from './dto/report.dto';
import { ApproveReportDto } from './dto/approve-report.dto';
import { AdminGuard } from '../guards/admin.guard';
import { GetEstimateDto } from './dto/get-estimate.dto';

@Controller('reports')
@Serialize(ReportDto)
export class ReportsController {
	constructor(private readonly reportsService: ReportsService) {}

	@Post()
	@UseGuards(AuthGuard)
	createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
		return this.reportsService.create(body, user);
	}

	@Patch('/:id')
	@UseGuards(AdminGuard)
	approvedReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
		return this.reportsService.changeApproval(id, body.approved);
	}

	@Get()
	getEstimate(@Query() query: GetEstimateDto) {
		return this.reportsService.createEstimate(query);
	}
}
