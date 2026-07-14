import { pool } from "../db/pool.js"; 

const services = [
  // PAKAIAN — PER KG
  {
    id: "10000000-0000-4000-8000-000000000001",
    name: "Cuci Kering Pakaian Reguler",
    itemCategory: "pakaian",
    itemSize: null,
    type: "cuci_kering",
    turnaroundType: "reguler",
    durationDays: 2,
    pricingUnit: "per_kg",
    price: 7000,
  },
  {
    id: "10000000-0000-4000-8000-000000000002",
    name: "Cuci Kering Pakaian Ekspres",
    itemCategory: "pakaian",
    itemSize: null,
    type: "cuci_kering",
    turnaroundType: "ekspres",
    durationDays: 1,
    pricingUnit: "per_kg",
    price: 10000,
  },
  {
    id: "10000000-0000-4000-8000-000000000003",
    name: "Setrika Pakaian Reguler",
    itemCategory: "pakaian",
    itemSize: null,
    type: "setrika_saja",
    turnaroundType: "reguler",
    durationDays: 2,
    pricingUnit: "per_kg",
    price: 5000,
  },
  {
    id: "10000000-0000-4000-8000-000000000004",
    name: "Paket Lengkap Pakaian Reguler",
    itemCategory: "pakaian",
    itemSize: null,
    type: "paket_lengkap",
    turnaroundType: "reguler",
    durationDays: 3,
    pricingUnit: "per_kg",
    price: 10000,
  },
  {
    id: "10000000-0000-4000-8000-000000000005",
    name: "Paket Lengkap Pakaian Ekspres",
    itemCategory: "pakaian",
    itemSize: null,
    type: "paket_lengkap",
    turnaroundType: "ekspres",
    durationDays: 1,
    pricingUnit: "per_kg",
    price: 15000,
  },

  // SPREI — PER BARANG
  {
    id: "10000000-0000-4000-8000-000000000006",
    name: "Cuci Sprei Kecil",
    itemCategory: "sprei",
    itemSize: "kecil",
    type: "cuci_kering",
    turnaroundType: "reguler",
    durationDays: 2,
    pricingUnit: "per_barang",
    price: 12000,
  },
  {
    id: "10000000-0000-4000-8000-000000000007",
    name: "Cuci Sprei Sedang",
    itemCategory: "sprei",
    itemSize: "sedang",
    type: "cuci_kering",
    turnaroundType: "reguler",
    durationDays: 2,
    pricingUnit: "per_barang",
    price: 15000,
  },
  {
    id: "10000000-0000-4000-8000-000000000008",
    name: "Cuci Sprei Besar",
    itemCategory: "sprei",
    itemSize: "besar",
    type: "cuci_kering",
    turnaroundType: "reguler",
    durationDays: 3,
    pricingUnit: "per_barang",
    price: 20000,
  },

  // BED COVER — PER BARANG
  {
    id: "10000000-0000-4000-8000-000000000009",
    name: "Cuci Bed Cover Kecil",
    itemCategory: "bed_cover",
    itemSize: "kecil",
    type: "cuci_kering",
    turnaroundType: "reguler",
    durationDays: 3,
    pricingUnit: "per_barang",
    price: 25000,
  },
  {
    id: "10000000-0000-4000-8000-000000000010",
    name: "Cuci Bed Cover Sedang",
    itemCategory: "bed_cover",
    itemSize: "sedang",
    type: "cuci_kering",
    turnaroundType: "reguler",
    durationDays: 3,
    pricingUnit: "per_barang",
    price: 35000,
  },
  {
    id: "10000000-0000-4000-8000-000000000011",
    name: "Cuci Bed Cover Besar",
    itemCategory: "bed_cover",
    itemSize: "besar",
    type: "cuci_kering",
    turnaroundType: "reguler",
    durationDays: 4,
    pricingUnit: "per_barang",
    price: 45000,
  },

  // SELIMUT — PER BARANG
  {
    id: "10000000-0000-4000-8000-000000000012",
    name: "Cuci Selimut Kecil",
    itemCategory: "selimut",
    itemSize: "kecil",
    type: "cuci_kering",
    turnaroundType: "reguler",
    durationDays: 2,
    pricingUnit: "per_barang",
    price: 15000,
  },
  {
    id: "10000000-0000-4000-8000-000000000013",
    name: "Cuci Selimut Sedang",
    itemCategory: "selimut",
    itemSize: "sedang",
    type: "cuci_kering",
    turnaroundType: "reguler",
    durationDays: 3,
    pricingUnit: "per_barang",
    price: 20000,
  },
  {
    id: "10000000-0000-4000-8000-000000000014",
    name: "Cuci Selimut Besar",
    itemCategory: "selimut",
    itemSize: "besar",
    type: "cuci_kering",
    turnaroundType: "reguler",
    durationDays: 3,
    pricingUnit: "per_barang",
    price: 30000,
  },

  // KARPET — PER METER
  {
    id: "10000000-0000-4000-8000-000000000015",
    name: "Cuci Karpet Reguler",
    itemCategory: "karpet",
    itemSize: null,
    type: "cuci_saja",
    turnaroundType: "reguler",
    durationDays: 4,
    pricingUnit: "per_meter",
    price: 15000,
  },
  {
    id: "10000000-0000-4000-8000-000000000016",
    name: "Cuci Karpet Ekspres",
    itemCategory: "karpet",
    itemSize: null,
    type: "cuci_saja",
    turnaroundType: "ekspres",
    durationDays: 2,
    pricingUnit: "per_meter",
    price: 22000,
  },

  // BONEKA — PER BARANG
  {
    id: "10000000-0000-4000-8000-000000000017",
    name: "Cuci Boneka Kecil",
    itemCategory: "boneka",
    itemSize: "kecil",
    type: "cuci_kering",
    turnaroundType: "reguler",
    durationDays: 2,
    pricingUnit: "per_barang",
    price: 15000,
  },
  {
    id: "10000000-0000-4000-8000-000000000018",
    name: "Cuci Boneka Sedang",
    itemCategory: "boneka",
    itemSize: "sedang",
    type: "cuci_kering",
    turnaroundType: "reguler",
    durationDays: 3,
    pricingUnit: "per_barang",
    price: 25000,
  },
  {
    id: "10000000-0000-4000-8000-000000000019",
    name: "Cuci Boneka Besar",
    itemCategory: "boneka",
    itemSize: "besar",
    type: "cuci_kering",
    turnaroundType: "reguler",
    durationDays: 4,
    pricingUnit: "per_barang",
    price: 40000,
  },

  // GORDEN — PER METER
  {
    id: "10000000-0000-4000-8000-000000000020",
    name: "Cuci Gorden Reguler",
    itemCategory: "gorden",
    itemSize: null,
    type: "cuci_saja",
    turnaroundType: "reguler",
    durationDays: 3,
    pricingUnit: "per_meter",
    price: 12000,
  },
  {
    id: "10000000-0000-4000-8000-000000000021",
    name: "Cuci Gorden Ekspres",
    itemCategory: "gorden",
    itemSize: null,
    type: "cuci_saja",
    turnaroundType: "ekspres",
    durationDays: 2,
    pricingUnit: "per_meter",
    price: 18000,
  },
];

async function seedServices() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (const service of services) {
      await client.query(
        `
          INSERT INTO services (
            id,
            name,
            item_category,
            item_size,
            type,
            turnaround_type,
            duration_days,
            pricing_unit,
            price
          )
          VALUES (
            $1, $2, $3, $4, $5,
            $6, $7, $8, $9
          )
          ON CONFLICT (id)
          DO UPDATE SET
            name = EXCLUDED.name,
            item_category = EXCLUDED.item_category,
            item_size = EXCLUDED.item_size,
            type = EXCLUDED.type,
            turnaround_type = EXCLUDED.turnaround_type,
            duration_days = EXCLUDED.duration_days,
            pricing_unit = EXCLUDED.pricing_unit,
            price = EXCLUDED.price,
            updated_at = CURRENT_TIMESTAMP
        `,
        [
          service.id,
          service.name,
          service.itemCategory,
          service.itemSize,
          service.type,
          service.turnaroundType,
          service.durationDays,
          service.pricingUnit,
          service.price,
        ],
      );
    }

    await client.query("COMMIT");

    console.log(
      `${services.length} data layanan berhasil dimasukkan.`,
    );
  } catch (error) {
    await client.query("ROLLBACK");

    console.error(
      "Gagal memasukkan data layanan:",
      error,
    );

    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

seedServices();