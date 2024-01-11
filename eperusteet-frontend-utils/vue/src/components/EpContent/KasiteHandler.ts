import _ from 'lodash';

export interface ITermi {
  id?: number;
  avain?: string;
  termi?: { [key: string]: string; };
  selitys?: { [key: string]: string; };
  alaviite?: boolean;
}

export interface ITermiStore {
  getTermi: (avain: string) => Promise<any>;
  getAllTermit: () => Promise<any>;
  updateTermi: (termiId: number, termi: ITermi) => Promise<any>;
  addTermi: (termi: ITermi) => Promise<any>;
  alaviiteSupported?: () => boolean;
}

export interface IKasiteHandler {
  /**
   * Hae yksi termi termin avainarvolla (UUID)
   */
  getOne: (avain: string) => Promise<ITermi>,

  /**
   * Hae kaikki termit
   */
  getAll: () => Promise<ITermi[]>,

  /**
   * Lisää uusi termi tai päivitä termiä. Vanhaa päivitetään jos `avain` ja `id` löytyy.
   */
  addOrUpdate: (termi: ITermi) => Promise<ITermi>,
};

export function createKasiteHandler(store: ITermiStore): IKasiteHandler {
  return {
    async getOne(avain: string) {
      const res = await store.getTermi(avain);
      return res.data;
    },
    async getAll() {
      const res = await store.getAllTermit();
      return res.data;
    },
    async addOrUpdate(termi: ITermi) {
      if (termi.avain && termi.id) {
        return (await store.updateTermi(termi.id, termi)).data;
      }
      else {
        return (await store.addTermi(termi)).data;
      }
    },
  };
};
