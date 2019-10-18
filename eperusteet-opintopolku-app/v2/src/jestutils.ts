import { PerusteStore } from '@/stores/PerusteStore';
import { PerusteKoosteStore } from '@/stores/PerusteKoosteStore';
import { TiedoteStore } from '@/stores/TiedoteStore';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import Vue from 'vue';
import _ from 'lodash';
import { RouterLinkStub, Wrapper } from '@vue/test-utils';

import '@/config/bootstrap';
import '@/config/fontawesome';


export function findAllContaining<T extends Vue>(wrapper: Wrapper<T>, selector: string, text: string) {
  return wrapper.findAll(selector).filter(r => r.text().includes(text));
}

export function findContaining<T extends Vue>(wrapper: Wrapper<T>, selector: string, text: string) {
  const results = findAllContaining(wrapper, selector, text);
  if (results.length !== 1) {
    throw new Error('Multiple results: ' + selector + ' ' + text);
  }
  return results.at(0);
}

export const mocks = Object.freeze({
  $t: x => x,
  $kaanna: x => x ? x.fi : 'kaanna',
  $sd: x => x,
  $ld: x => x,
}) as any;

export const stubs = Object.freeze({
  RouterLink: RouterLinkStub,
}) as any;

function wrap<T extends object>(original: T, value: T) {
  const result: any = {};

  // Get original implementations
  for (const k in original) {
    if (_.isFunction(original[k])) {
      result[k] = jest.fn(original[k] as any);
    }
    else {
      result[k] = original[k];
    }
  }

  // Overwrite with default mocks
  _.forEach(value, (v, k) => {
    if (_.isFunction(v)) {
      result[k] = jest.fn(v);
    }
    else {
      result[k] = Vue.observable(v);
    }
  });

  const Mock = jest.fn(() => Vue.observable(result) as T);
  return new Mock();
}

export const perusteKoosteStoreMock = (config: Partial<PerusteKoosteStore> = {}) => {
  return wrap(PerusteKoosteStore.prototype, {
    perusteet: null,
    opetussuunnitelmat: null,
    tiedotteet: null,
    koulutustyyppi: null,
    perusteId: null,
    async reload() {},
    constructor(koulutustyyppi: string,
      perusteId?: number) {
      this.koulutustyyppi = koulutustyyppi;
      this.perusteId = perusteId || null;
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
