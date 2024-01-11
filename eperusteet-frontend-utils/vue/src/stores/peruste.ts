import _ from 'lodash';
import Vue from 'vue';

import { Lops2019Perusteet, Lops2019OppiaineDto } from '@shared/api/ylops';

function sortedOppiaineet(oppiaineet: Lops2019OppiaineDto[]) {
  return _.chain(oppiaineet)
    .map(oa => {
      return {
        ...oa,
        oppimaarat: sortedOppiaineet(oa.oppimaarat || []),
        moduulit: _.sortBy(oa.moduulit || [], 'koodi.arvo'),
      };
    })
    .sortBy('koodi.arvo')
    .value();
}

export class PerusteCache {
  private static cache: any = Vue.observable({});

  constructor(
    private opsId: number,
  ) {
  }

  get peruste(): any {
    return PerusteCache.cache[this.opsId];
  }

  public async getOppiaine(id: number) {
    const result = (await Lops2019Perusteet.getAllLops2019PerusteOppiaineById(this.opsId, id)).data;
    return result;
  }

  public async getOppiaineenModuulit(koodiUri: string) {
    const result = (await Lops2019Perusteet.getAllLops2019PerusteOppiaineenModuulit(this.opsId, koodiUri)).data;
    return result;
  }

  public async getModuuli(oppiaineId: number, id: number) {
    const result = await Lops2019Perusteet.getAllLops2019PerusteModuuli(this.opsId, oppiaineId, id);
    return result.data;
  }

  private async init() {
    if (!PerusteCache.cache[this.opsId]) {
      const sisalto = (await Lops2019Perusteet.getAllLops2019PerusteSisalto(this.opsId)).data;
      Vue.set(PerusteCache.cache, this.opsId, {
        ...sisalto,
        oppiaineet: sortedOppiaineet(sisalto.oppiaineet || []),
      });
    }
  }

  static async of(opsId: number) {
    const result = new PerusteCache(opsId);
    await result.init();
    return result;
  }
}
