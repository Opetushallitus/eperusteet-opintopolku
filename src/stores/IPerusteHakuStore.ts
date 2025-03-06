import { DebouncedFunc } from 'lodash';

export interface IPerusteHakuStore {
  fetch: () => Promise<void>;
  toggles: string[];
  perusteet: any
  total: number;
  pages: number;
  page: number;
  perPage: number;
  filters: any;
  updateFilters: (filter: any) => Promise<void>;
};
