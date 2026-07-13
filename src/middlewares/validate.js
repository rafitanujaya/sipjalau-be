export function validateRequest(schema) {
  return function validationMiddleware(
    req,
    res,
    next,
  ) {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      const errorMap = new Map();

      for (const issue of result.error.issues) {
        const field = issue.path
          .filter(
            (path) =>
              path !== "body" &&
              path !== "params" &&
              path !== "query",
          )
          .join(".");

        // Hanya simpan error pertama dari setiap field
        if (!errorMap.has(field)) {
          errorMap.set(field, {
            field,
            message: issue.message,
          });
        }
      }

      return res.status(422).json({
        success: false,
        message:
          "Data yang dikirim tidak valid.",
        errors: Array.from(
          errorMap.values(),
        ),
      });
    }

    req.validated = result.data;

    next();
  };
}