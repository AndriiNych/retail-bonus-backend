import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Receipt } from './receipt.entity';
import { ReceiptResponseBaseDto } from './dto/receipt-response-base.dto';

@Injectable()
export class ReceiptRepository extends Repository<Receipt> {
  constructor(private dataSource: DataSource) {
    super(Receipt, dataSource.createEntityManager());
  }

  public async fetchReceiptByUuidWithValidation(
    uuid: string,
  ): Promise<ReceiptResponseBaseDto> {
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

  private async fetchReceiptByUuid(
    uuid: string,
  ): Promise<ReceiptResponseBaseDto> {
    return await this.findOneBy({ uuid });
  }
}
