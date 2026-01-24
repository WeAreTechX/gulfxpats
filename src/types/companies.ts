export interface CompanyCreate {
  name: string;
  short_description: string;
  long_description: string | null;
  website_url: string;
  logo_url: string | undefined;
  location: string;
  metadata: {
    [key: string]: string | undefined;
  };
  contact_person: {
    [key: string]: string | undefined;
  };
  status_id: number;
}

export interface Company extends CompanyCreate {
  id: string;
  created_at: Date | string;
  modified_at: Date | string;
  jobs_count: number;
}