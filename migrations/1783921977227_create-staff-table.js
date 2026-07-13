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
    pgm.createType("staff_role_enum", [
    "cashier",
    "manager",
  ]);

  pgm.createTable("staff", {
    id: {
      type: "varchar(36)",
      primaryKey: true,
    },

    name: {
      type: "varchar(150)",
      notNull: true,
    },

    username: {
      type: "varchar(50)",
      notNull: true,
      unique: true,
    },

    password: {
      type: "varchar(255)",
      notNull: true,
    },

    role: {
      type: "staff_role_enum",
      notNull: true,
      default: "cashier",
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
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable("staff");
    pgm.dropType("staff_role_enum");
};
