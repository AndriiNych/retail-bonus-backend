import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Receipt } from './receipt.entity';

@Injectable()
export class ReceiptRepository extends Repository<Receipt> {
  constructor(private dataSource: DataSource) {
    super(Receipt, dataSource.createEntityManager());
  }

  public async deleteReceiptByUuid(uuid: string): Promise<Receipt> {
    const receipt = await this.fetchReceiptByUuidWithValidation(uuid);

    await this.delete({ uuid });

    return receipt;
  }

  public async saveWithValidationAndTransaction(
    receipt: Receipt,
    manager: EntityManager,
  ): Promise<Receipt> {
    await this.isExistReceipt(receipt.uuid);

    const result = await manager.save(Receipt, receipt);

    return result;
  }

  //TODO correct all scopes for methods

  public async fetchReceiptByUuidWithValidation(
    uuid: string,
  ): Promise<Receipt> {
    const receipt = await this.fetchReceiptByUuid(uuid);

    if (!receipt) {
      throw new NotFoundException(`Record with uuid ${uuid} does not exist.`);
    }

    return receipt;
  }

  public async isExistReceipt(uuid: string): Promise<void> {
    const receipt = await this.fetchReceiptByUuid(uuid);
    if (receipt) {
      throw new ConflictException(`Record with uuid: ${uuid} already exists.`);
    }
  }

  private async fetchReceiptByUuid(uuid: string): Promise<Receipt> {
    return await this.findOneBy({ uuid });
  }
}
