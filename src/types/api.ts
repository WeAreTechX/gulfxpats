import {Pagination} from "@/types/index";

export interface Query {
  search?: string;
  limit?: number;
  offset?: number;
  order?: string;
}

export interface QueryStats {
  [key: string]: number
}

export interface QueryResponse<T> {
  pagination: Pagination;
  list: T[]
}