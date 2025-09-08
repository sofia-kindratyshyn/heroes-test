import createHttpError from 'http-errors';

export const validateBody = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.body, {
        abortEarly: false,
        convert: true,
      });
      next();
    } catch (err) {
      const error = createHttpError(
        400,
        'Bad Request',
        Array.isArray(err.details)
          ? err.details.map(({ message, path }) => {
              return {
                message,
                path,
              };
            })
          : { errors: err.details },
      );
      next(error);
    }
  };
};

export const validateQuery = async (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.query, {
        abortEarly: false,
        convert: true,
      });
      next();
    } catch (err) {
      const error = createHttpError(
        400,
        'Bad Request',
        Array.isArray(err.details)
          ? err.details.map(({ message, path }) => {
              return {
                message,
                path,
              };
            })
          : { errors: err.details },
      );
      next(error);
    }
  };
};
