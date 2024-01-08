import { DebouncedFunc } from 'lodash';

export interface IPerusteHakuStore {
  fetch: DebouncedFunc<() => Promise<void>>
  toggles: string[];
  perusteet: any
  total: number;
  pages: number;
  page: number;
  perPage: number;
  filters: any;
  updateFilters: (filter: any) => void;
};
