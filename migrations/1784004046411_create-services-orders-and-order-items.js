/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createType("kategori_barang_enum", [
    "pakaian",
    "sprei",
    "bed_cover",
    "selimut",
    "karpet",
    "boneka",
    "gorden",
  ]);

  pgm.createType("ukuran_barang_enum", ["kecil", "sedang", "besar"]);

  pgm.createType("jenis_layanan_enum", [
    "cuci_kering",
    "setrika_saja",
    "paket_lengkap",
    "cuci_saja",
  ]);

  pgm.createType("jenis_pengerjaan_enum", ["reguler", "ekspres"]);

  pgm.createType("satuan_harga_enum", ["per_kg", "per_barang", "per_meter"]);

  pgm.createType("status_pesanan_enum", [
    "diproses",
    "sedang_dicuci",
    "siap_diambil",
    "sudah_diambil",
  ]);

  pgm.createType("metode_pembayaran_enum", ["tunai", "qris", "transfer_bank"]);

  pgm.createType("status_pembayaran_enum", ["belum_bayar", "lunas"]);

  pgm.createTable("services", {
    id: {
      type: "varchar(36)",
      primaryKey: true,
    },

    name: {
      type: "varchar(150)",
      notNull: true,
    },

    item_category: {
      type: "kategori_barang_enum",
      notNull: true,
    },

    item_size: {
      type: "ukuran_barang_enum",
    },

    type: {
      type: "jenis_layanan_enum",
      notNull: true,
    },

    turnaround_type: {
      type: "jenis_pengerjaan_enum",
      notNull: true,
    },

    duration_days: {
      type: "integer",
      notNull: true,
    },

    pricing_unit: {
      type: "satuan_harga_enum",
      notNull: true,
    },

    price: {
      type: "bigint",
      notNull: true,
    },

    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },

    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  });

  pgm.addConstraint("services", "chk_services_duration_days", {
    check: "duration_days > 0",
  });

  pgm.addConstraint("services", "chk_services_price", {
    check: "price >= 0",
  });

  pgm.createTable("orders", {
    id: {
      type: "varchar(36)",
      primaryKey: true,
    },

    invoice_number: {
      type: "varchar(50)",
      notNull: true,
      unique: true,
    },

    customer_id: {
      type: "varchar(36)",
      notNull: true,
      references: "customers",
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    },

    cashier_id: {
      type: "varchar(36)",
      notNull: true,
      references: "staff(id)",
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    },

    status: {
      type: "status_pesanan_enum",
      notNull: true,
      default: "diproses",
    },

    payment_method: {
      type: "metode_pembayaran_enum",
    },

    payment_status: {
      type: "status_pembayaran_enum",
      notNull: true,
      default: "belum_bayar",
    },

    total: {
      type: "bigint",
      notNull: true,
      default: 0,
    },

    notes: {
      type: "text",
    },

    received_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },

    estimated_done_at: {
      type: "timestamptz",
    },

    completed_at: {
      type: "timestamptz",
    },

    picked_up_at: {
      type: "timestamptz",
    },

    paid_at: {
      type: "timestamptz",
    },

    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },

    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  });

  pgm.addConstraint("orders", "chk_orders_total", {
    check: "total >= 0",
  });

  pgm.createTable("order_items", {
    id: {
      type: "varchar(36)",
      primaryKey: true,
    },

    order_id: {
      type: "varchar(36)",
      notNull: true,
      references: "orders",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    service_id: {
      type: "varchar(36)",
      notNull: true,
      references: "services",
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    },

    weight: {
      type: "numeric(10,2)",
    },

    quantity: {
      type: "integer",
    },

    length: {
      type: "numeric(10,2)",
    },

    unit_price: {
      type: "bigint",
      notNull: true,
    },

    subtotal: {
      type: "bigint",
      notNull: true,
    },

    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },

    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  });

  pgm.addConstraint("order_items", "chk_order_items_unit_price", {
    check: "unit_price >= 0",
  });

  pgm.addConstraint("order_items", "chk_order_items_subtotal", {
    check: "subtotal >= 0",
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("order_items");
  pgm.dropTable("orders");
  pgm.dropTable("services");

  pgm.dropType("status_pembayaran_enum");
  pgm.dropType("metode_pembayaran_enum");
  pgm.dropType("status_pesanan_enum");
  pgm.dropType("satuan_harga_enum");
  pgm.dropType("jenis_pengerjaan_enum");
  pgm.dropType("jenis_layanan_enum");
  pgm.dropType("ukuran_barang_enum");
  pgm.dropType("kategori_barang_enum");
};
