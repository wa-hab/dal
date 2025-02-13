import Express from "express";

export type TypedRequest<T> = T extends {
  params?: infer P;
  body?: infer B;
  query?: infer Q;
}
  ? Express.Request & {
      params: P extends object ? P : Record<string, never>;
      body: B extends object ? B : Record<string, never>;
      query: Q extends object ? Q : Record<string, never>;
    }
  : Express.Request;

export type ApiResponse<DataType, ErrorType> = {
  data: DataType | null;
  error: ErrorType | null;
};
