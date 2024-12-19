import { Injectable } from '@nestjs/common';
import { RegisterBalansService } from '@src/entities/register-balans/register-balans.service';
import { DataSource } from 'typeorm';
import { DailyTasksQueryBaseDto } from './dto/daily-tasks.query.base.dto';
import { CustomerResponseDto } from '@src/entities/customer/dto/customer-response.dto';
import { CustomerService } from '@src/entities/customer/customer.service';
import { wrapperResponseEntity } from '@src/utils/response-wrapper/wrapper-response-entity';
import { TABLE_NAMES } from '@src/db/const-tables';
import { DailyTasksParamsDto } from './dto/dayly-tasks.params.dto';
import { RegisterSavingService } from '@src/entities/register-saving/register-saving.service';
import { DailyTasksPeriodQueryDto } from './dto/daiy-tasks-period.query.dtp';
import { RecalculateCustomer } from './service/recalculate.customer';
import { CustomerAndDate } from '@src/types/customer-date.dto';

@Injectable()
export class DailyTasksService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly registerBalansService: RegisterBalansService,
    private readonly registerSavingService: RegisterSavingService,
    private readonly customerService: CustomerService,
    private readonly recalculateCustomer: RecalculateCustomer,
  ) {}

  public async processDailyRecalculateCustomerByDate(
    dailyTasksParamsDto: DailyTasksParamsDto,
    dailyTasksQueryBaseDto: DailyTasksQueryBaseDto,
  ): Promise<Record<string, CustomerResponseDto[]>> {
    const updatedCustomer = await this.dataSource.transaction(async manager => {
      const { customerId } = dailyTasksParamsDto;
      const { date } = dailyTasksQueryBaseDto;

      this.recalculateCustomer.setParams(manager, customerId, date);
      return await this.recalculateCustomer.processDailyRecalculateCustomerByDateIntoTransaction();
    });

    return wrapperResponseEntity(updatedCustomer, CustomerResponseDto, TABLE_NAMES.customer);
  }

  public async processDailyRecalculateBonusByPeriod(
    dailyTasksPeriodQueryDto: DailyTasksPeriodQueryDto,
  ): Promise<Record<string, CustomerResponseDto[]>> {
    const customers =
      await this.prepareCustomerListForDailyRecalculateBonusByPeriodAndCustomer(
        dailyTasksPeriodQueryDto,
      );

    const recalculatedCustomerList = await Promise.all(
      customers.map(customer => this.processDailyRecalculateBonusByPeriodAndCustomer(customer)),
    );

    return wrapperResponseEntity(
      recalculatedCustomerList,
      CustomerResponseDto,
      TABLE_NAMES.customer,
    );
  }

  private async prepareCustomerListForDailyRecalculateBonusByPeriodAndCustomer(
    dailyTasksPeriodQueryDto: DailyTasksPeriodQueryDto,
  ): Promise<CustomerAndDate[]> {
    const {
      date: { gte: startDate, lte: endDate },
    } = dailyTasksPeriodQueryDto;
    const customers = await this.dataSource.transaction(async manager => {
      const customerList = await this.registerBalansService.getListCustomerIdByPeriod(manager, {
        startDate,
        endDate,
      });

      return customerList.map(customer => ({ customerId: customer, date: endDate }));
    });

    return customers;
  }

  private async processDailyRecalculateBonusByPeriodAndCustomer({
    customerId,
    date,
  }: CustomerAndDate): Promise<CustomerResponseDto> {
    return await this.dataSource.transaction(async manager => {
      const instanse = new RecalculateCustomer(
        this.registerBalansService,
        this.registerSavingService,
        this.customerService,
      );
      instanse.setParams(manager, customerId, date);
      return await instanse.processDailyRecalculateCustomerByDateIntoTransaction();
    });
  }
}
