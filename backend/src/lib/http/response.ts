export type ApiSuccess<T> = {
  data: T;
};

export function formatSuccessResponse<T>(data: T): ApiSuccess<T> {
  return { data };
}
