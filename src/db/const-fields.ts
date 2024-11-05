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

export const FIELDS = {
  DECIMAL: {
    type: 'decimal' as const,
    precision: 12,
    scale: 2,
    nullable: true,
    default: 0,
    collation: 'utf8_general_ci',
  },
  PERCENT: {
    type: 'decimal' as const,
    precision: 5,
    scale: 2,
    nullable: true,
    collation: 'utf8_general_ci',
  },
  TEXT_ROW: {
    type: 'varchar' as const,
    length: 250,
    nullable: true,
    default: '',
    collation: 'utf8_general_ci',
  },
  PHONE: {
    type: 'varchar' as const,
    length: 50,
    nullable: true,
    default: '',
    collation: 'utf8_general_ci',
  },
  EMAIL: {
    type: 'varchar' as const,
    length: 50,
    nullable: true,
    default: '',
    collation: 'utf8_general_ci',
  },
  UUID: {
    type: 'varchar' as const,
    length: 40,
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
