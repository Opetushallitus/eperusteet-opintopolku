import Vue from 'vue';
import _ from 'lodash';

import { PerusteStore } from '@/stores/PerusteStore';
import { PerusteKoosteStore } from '@/stores/PerusteKoosteStore';
import { TiedoteStore } from '@/stores/TiedoteStore';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import { Lops2019OppiaineetStore } from '@/stores/Lops2019OppiaineetStore';
import { Wrapper } from '@vue/test-utils';

import '@/config/bootstrap';
import '@/config/fontawesome';
import { wrap } from '@shared/utils/jestutils';

export const perusteKoosteStoreMock = (config: Partial<PerusteKoosteStore> = {}) => {
  return wrap(PerusteKoosteStore.prototype, {
    perusteet: null,
    opetussuunnitelmat: null,
    tiedotteet: null,
    koulutustyyppi: null,
    perusteId: null,
    async reload() {},
    constructor(koulutustyyppi: string,
      perusteId: number) {
      this.koulutustyyppi = koulutustyyppi;
      this.perusteId = perusteId;
    },
    ...config,
  } as PerusteKoosteStore);
};


export const perusteStoreMock = (config: Partial<PerusteStore> = {}) => {
  return wrap(PerusteStore.prototype, {
    uusimmat: null,
    perusteet: null,
    async getUusimmat() {},
    async getYleisetPerusteet() {},
    ...config,
  } as PerusteStore);
};


export const tiedoteStoreMock = (config: Partial<TiedoteStore> = {}) => {
  return wrap(TiedoteStore.prototype, {
    uusimmatTiedotteet: null,
    async getUusimmat() {},
    ...config,
  } as TiedoteStore);
};


export const perusteDataStoreMock = (config: Partial<PerusteDataStore> = {}) => {
  return wrap(PerusteDataStore.prototype, {
    ...config,
  } as PerusteDataStore);
};

export const lops2019OppiaineetStoreMock = (config: Partial<Lops2019OppiaineetStore> = {}) => {
  return wrap(Lops2019OppiaineetStore.prototype, {
    ...config,
  } as Lops2019OppiaineetStore);
};
