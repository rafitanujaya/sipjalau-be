export function errorHandler(
  error,
  req,
  res,
  next,
) {
  console.error(error);

  if (error.code === "23505") {
    return res.status(409).json({
      success: false,
      message:
        "Data yang sama sudah digunakan.",
    });
  }

  if (error.code === "22P02") {
    return res.status(400).json({
      success: false,
      message:
        "Format data tidak valid.",
    });
  }

  const statusCode =
    error.statusCode ?? 500;

  res.status(statusCode).json({
    success: false,

    message:
      statusCode === 500
        ? "Terjadi kesalahan pada server."
        : error.message,

    ...(error.details
      ? {
          details: error.details,
        }
      : {}),
  });
}