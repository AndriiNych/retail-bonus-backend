import { CustomerResponseDto } from '@src/entities/customer/dto/customer-response.dto';
import { ReceiptResponseDto } from '@src/entities/receipt/dto/receipt-response.dto';

export type GeneralResponseDto = ReceiptResponseDto | CustomerResponseDto;
