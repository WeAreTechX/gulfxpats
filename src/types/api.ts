export interface Query {
  search?: string;
  limit?: number;
  offset?: number;
}

export interface CompanyQuery extends Query {
  location?: string;
}

export interface JobQuery extends Query {
  location?: string;
  job_type_id?: string | number;
  job_industry_id?: string | number;
}

export interface QueryStats {
  [key: string]: number
}