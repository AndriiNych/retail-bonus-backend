import { Injectable } from '@nestjs/common';
import { ActiveType, DocumentType } from '@src/entities/register-balans/utils/types';
import { BONUS } from '@src/utils/bonus';

@Injectable()
export class SettingService {
  constructor() {}

  public getSettings() {
    return {
      settings: {
        ...this.getSettingsBonus(),
        ...this.getSettingsEnv(),
        ...this.getActiveType(),
        ...this.getDocumentType(),
      },
    };
  }

  private getSettingsBonus() {
    return {
      bonus: {
        ...BONUS,
      },
    };
  }

  private getSettingsEnv() {
    return {
      env: {
        store_box_delta: process.env.STORE_BOX_DELTA,
        start_date: process.env.START_DATE,
      },
    };
  }

  private getActiveType() {
    return { activeType: { ...ActiveType } };
  }

  private getDocumentType() {
    return { documentType: { ...DocumentType } };
  }
}
