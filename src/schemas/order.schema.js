import { z } from "zod";

const customerSchema = z.object({
  fullname: z
    .string()
    .trim()
    .min(3, "Nama pelanggan minimal 3 karakter.")
    .max(150, "Nama pelanggan maksimal 150 karakter."),

  phoneNumber: z
    .string()
    .trim()
    .min(8, "Nomor telepon minimal 8 karakter.")
    .max(20, "Nomor telepon maksimal 20 karakter.")
});

const orderItemSchema = z.object({
  serviceId: z
    .string()
    .uuid("ID layanan tidak valid."),

  weight: z.coerce
    .number()
    .positive("Berat harus lebih dari 0.")
    .optional(),

  quantity: z.coerce
    .number()
    .int("Jumlah barang harus berupa bilangan bulat.")
    .positive("Jumlah barang harus lebih dari 0.")
    .optional(),

  length: z.coerce
    .number()
    .positive("Panjang harus lebih dari 0.")
    .optional(),
});

export const createOrderSchema = z.object({
  body: z
    .object({
      customer: customerSchema,

      turnaroundType: z.enum(
        ["reguler", "ekspress"],
        {
          message:
            "Jenis pengerjaan harus berupa reguler atau ekspres.",
        },
      ),

      paymentStatus: z.enum(
        ["belum_bayar", "lunas"],
        {
          message:
            "Status pembayaran harus berupa belum_bayar atau lunas.",
        },
      ),

      paymentMethod: z
        .enum(
          [
            "tunai",
            "qris",
            "transfer_bank",
          ],
          {
            message:
              "Metode pembayaran harus berupa tunai, qris, atau transfer_bank.",
          },
        )
        .nullable()
        .optional(),

      notes: z
        .string()
        .trim()
        .max(1000, "Catatan maksimal 1000 karakter.")
        .nullable()
        .optional(),

      items: z
        .array(orderItemSchema)
        .min(
          1,
          "Pesanan minimal memiliki satu layanan.",
        )
        .max(
          50,
          "Pesanan maksimal memiliki 50 item layanan.",
        ),
    })
    .superRefine((data, ctx) => {
      if (
        data.paymentStatus === "lunas" &&
        !data.paymentMethod
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["paymentMethod"],
          message:
            "Metode pembayaran wajib diisi jika pesanan sudah dibayar.",
        });
      }

      if (
        data.paymentStatus === "belum_bayar" &&
        data.paymentMethod
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["paymentMethod"],
          message:
            "Metode pembayaran harus kosong jika pesanan belum dibayar.",
        });
      }
    }),
});