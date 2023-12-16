export type ApiListRequest = {
  search: string;
  page: number;
  per_page: number;
};

export type ApiPaginationResponse = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  to: number;
};

export interface ApiListResponse<T> extends ApiPaginationResponse {
  data: T[];
}

export const defaultApiListOptions: ApiListRequest = {
  search: "",
  page: 1,
  per_page: 15,
};
