type ErrorResponseInput = {
  code: string;
  message: string;
  requestId: string;
  statusCode: number;
  details?: unknown;
};

export type ApiError = {
  error: {
    code: string;
    message: string;
    requestId: string;
    statusCode: number;
    details?: unknown;
  };
};

export function formatErrorResponse(input: ErrorResponseInput): ApiError {
  return {
    error: {
      code: input.code,
      message: input.message,
      requestId: input.requestId,
      statusCode: input.statusCode,
      ...(input.details === undefined ? {} : { details: input.details })
    }
  };
}
