export interface Pagination {
  limit: number;
  page: number;
  totalPages: number;
  totalPosts: number;
}

export type AvertraResponseList<T, V extends string> = Record<V, T> & {
  pagination: Pagination;
};

export interface AvertraResponseListResponse<T, V extends string> {
  data: AvertraResponseList<T, V>;
  success: boolean;
}

export interface AvertraMutationResponse<T> {
  data: T;
  success: boolean;
}
