import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Receipt } from './receipt.entity';
import { ReceiptDto } from './dto/receipt.dto';
import { ResponseWrapperDto } from '@src/utils/response-wrapper/dto/response-wrapper.dto';
import { ReceiptResponseDto } from './dto/receipt-response.dto';
import { responseWrapper } from '@src/utils/response-wrapper/response-wrapper';
import { ReceiptParamsDto } from './dto/receipt-params.dto';
import { ReceiptUpdateDto } from './dto/receipt-update.dto';

@Injectable()
export class ReceiptService {
  constructor(
    @InjectRepository(Receipt)
    private readonly receiptRepository: Repository<Receipt>,
  ) {}

  public async createReceipt(
    receiptDto: ReceiptDto,
  ): Promise<ResponseWrapperDto<ReceiptResponseDto>> {
    await this.isExistReceipt(receiptDto.uuid);

    const newReceipt = this.receiptRepository.create(receiptDto);

    const resultSave = await this.receiptRepository.save(newReceipt);

    const result = resultSave ? [resultSave] : [];

    return responseWrapper(result, ReceiptResponseDto);
  }

  public async deleteReceipt(
    receiptParamsDtoDto: ReceiptParamsDto,
  ): Promise<ResponseWrapperDto<ReceiptResponseDto>> {
    const { uuid } = receiptParamsDtoDto;

    const receipt = await this.getReceiptByUuidWithValidation(uuid);

    await this.receiptRepository.delete({ uuid });
    const result = [receipt];

    return responseWrapper(result, ReceiptResponseDto);
  }

  public async updateReceiptByUuid(
    receiptParamsDto: ReceiptParamsDto,
    receiptUpdateDto: ReceiptUpdateDto,
  ): Promise<ResponseWrapperDto<ReceiptResponseDto>> {
    const { uuid } = receiptParamsDto;

    await this.getReceiptByUuidWithValidation(uuid);

    const resultUpdate = await this.receiptRepository.update(
      { uuid },
      receiptUpdateDto,
    );

    const result = [];

    if (resultUpdate.affected === 1) {
      result.push(await this.getReceiptByUuid(uuid));
    }

    return responseWrapper(result, ReceiptResponseDto);
  }

  private async getReceiptByUuidWithValidation(
    uuid: string,
  ): Promise<ReceiptResponseDto> {
    const receipt = await this.getReceiptByUuid(uuid);

    if (!receipt) {
      throw new NotFoundException(`Record with uuid ${uuid} does not exist.`);
    }

    return receipt;
  }

  private async getReceiptByUuid(uuid: string): Promise<ReceiptResponseDto> {
    return await this.receiptRepository.findOneBy({ uuid });
  }

  private async isExistReceipt(uuid: string): Promise<void> {
    const receipt = this.getReceiptByUuid(uuid);
    if (receipt) {
      throw new ConflictException(`Record with uuid: ${uuid} already exists.`);
    }
  }
}
