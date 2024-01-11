import _ from 'lodash';
import { AxiosInstance } from 'axios';

export interface ILiite {
  src: string;
  id: string;
  nimi: string;
};

export interface IKuvaStore {
  getEndpoint: () => string;
  getAllKuvat: () => Promise<any>;
  getBaseUrl: () => string;
  getApi: () => AxiosInstance;
}

export interface IKuvaHandler {
  endpoint: () => string;
  hae: () => Promise<ILiite[]>;
  url: (id: string) => string;
  api: () => AxiosInstance;
}

export function createKuvaHandler(kuvaStore: IKuvaStore): IKuvaHandler {
  return {
    endpoint() {
      return kuvaStore.getEndpoint();
    },

    url(id: string): string {
      return kuvaStore.getBaseUrl() + '/' + id;
    },

    async hae(): Promise<ILiite[]> {
      const result = await kuvaStore.getAllKuvat();
      return _.map(result.data, d => ({
        ...d,
        src: kuvaStore.getBaseUrl() + '/' + d.id,
      }));
    },

    api() {
      return kuvaStore.getApi();
    },
  };
}
