const DATE_SHABLON = {
  DATE: {
    type: 'datetime' as const,
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  },
  DATE_UPDATE: {
    type: 'datetime' as const,
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  },
};

export const FIELDS_LENGTH = {
  NAME: 250,
  UUID: 36,
  EMAIL: 50,
  PHONE: 12,
  DECIMAL: {
    PRECISION: 12,
    SCALE: 2,
  },
  PERCENT: {
    PRECISION: 5,
    SCALE: 2,
  },
};

export const MAX_VALUE = {
  PERCENT: 100,
};

export const FIELDS = {
  DECIMAL: {
    type: 'decimal' as const,
    precision: FIELDS_LENGTH.DECIMAL.PRECISION,
    scale: FIELDS_LENGTH.DECIMAL.SCALE,
    nullable: true,
    default: 0,
    collation: 'utf8_general_ci',
  },
  NUMBER: {
    type: 'int' as const,
    default: 0,
    nullable: true,
  },
  PERCENT: {
    type: 'decimal' as const,
    precision: FIELDS_LENGTH.PERCENT.PRECISION,
    scale: FIELDS_LENGTH.PERCENT.SCALE,
    nullable: true,
    collation: 'utf8_general_ci',
  },
  TEXT_ROW: {
    type: 'varchar' as const,
    length: FIELDS_LENGTH.NAME,
    nullable: true,
    default: '',
    collation: 'utf8_general_ci',
  },
  PHONE: {
    type: 'varchar' as const,
    length: FIELDS_LENGTH.PHONE,
    nullable: true,
    default: '',
    collation: 'utf8_general_ci',
  },
  EMAIL: {
    type: 'varchar' as const,
    length: FIELDS_LENGTH.EMAIL,
    nullable: true,
    default: '',
    collation: 'utf8_general_ci',
  },
  UUID: {
    type: 'varchar' as const,
    length: FIELDS_LENGTH.UUID,
    nullable: true,
    default: '',
    collation: 'utf8_general_ci',
  },
  DATE: { ...DATE_SHABLON.DATE },
  DATE_UPDATE: { ...DATE_SHABLON.DATE_UPDATE },
  CREATE_AT: {
    ...DATE_SHABLON.DATE,
    name: 'created_at',
  },
  UPDATED_AT: {
    ...DATE_SHABLON.DATE_UPDATE,
    name: 'updated_at',
  },
  IS_DELETED: { name: 'is_deleted', type: 'boolean' as const, default: false },
};
