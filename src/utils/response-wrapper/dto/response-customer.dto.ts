import { Expose } from 'class-transformer';

export class ResponseCustomerDto<T> {
  @Expose()
  customers: T[];

  constructor(customers: T[]) {
    this.customers = customers;
  }
}
