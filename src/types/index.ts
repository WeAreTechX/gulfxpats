import {Query} from "@/types/api";

export interface UserCreate {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  location: string;
  role: "user";
}

export interface User extends UserCreate {
  id: string;
  status_id: number;
}

export interface UserQuery extends Query {
  status?: string;
}

export type Admin = Omit<User, "role"> & {
  role: "admin" | "super_admin";
}

export enum StatusesType {
  Active = 1,
  Inactive ,
  Pending,
  Published,
  Unpublished,
  Archived,
  Enabled,
  Disabled,
  Verified,
  Unverified,
  Deleted
}

export interface Status {
  id?: number;
  name: string;
  code: string;
}

export interface Pagination {
  count: number;
  current_page: number;
  total_count: number;
  total_pages: number;
}

export interface Currency {
  id: number;
  code: string;
  symbol: string;
  name: string;
}