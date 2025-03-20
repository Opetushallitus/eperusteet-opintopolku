import { NavigationNode, NavigationFilter } from '@shared/utils/NavigationBuilder';

export interface IOpetussuunnitelmaStore {
  opetussuunnitelma: any;
  tila: any,
  koulutustyyppi: string;
  current: NavigationNode | null;
  sidenavFilter: NavigationFilter;
  filteredSidenav: NavigationNode | null;
  flattenedSidenav: NavigationNode[];
  sidenavLoading: boolean;
  updateRoute: (options) => any;
  updateFilter: (filter: NavigationFilter) => void;
  dokumentit: { [key: string]: string; };
  getDokumentit: () => Promise<void>;
  julkaisut: any[];
};
