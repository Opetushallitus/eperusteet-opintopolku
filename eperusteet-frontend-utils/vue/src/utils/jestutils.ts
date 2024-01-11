import Vue from 'vue';
import _ from 'lodash';
import { computed } from '@vue/composition-api';
import { Wrapper } from '@vue/test-utils';
import { EditointiStore, IEditoitava } from '../components/EpEditointi/EditointiStore';

import '../config/bootstrap';

export function mockEditointiStore<T>(config: Partial<IEditoitava> = {}) {
  const editointi = {
    acquire: jest.fn(async () => {
      const vanhentuu = new Date();
      vanhentuu.setMinutes(vanhentuu.getMinutes() + 10);
      return {
        haltijaOid: 'haltijaOid',
        haltijaNimi: 'haltijaNimi',
        luotu: new Date(),
        vanhentuu,
        oma: true,
        revisio: 1,
      };
    }),
    cancel: jest.fn(),
    editAfterLoad: jest.fn(async () => false),
    history: jest.fn(),
    load: jest.fn(),
    lock: jest.fn(async () => null),
    preview: jest.fn(async () => null),
    release: jest.fn(),
    remove: jest.fn(),
    restore: jest.fn(),
    revisions: jest.fn(),
    save: jest.fn(),
    start: jest.fn(),
    validator: computed(() => ({})),
    ...config,
  };
  return {
    store: new EditointiStore(editointi),
    config: editointi,
  };
}

export function findAllContaining<T extends Vue>(wrapper: Wrapper<T>, selector: string, text: string) {
  return wrapper.findAll(selector).filter(r => r.text().includes(text));
}

export function findContaining<T extends Vue>(wrapper: Wrapper<T>, selector: string, text: string) {
  const results = findAllContaining(wrapper, selector, text);
  if (results.length > 1) {
    throw new Error('Multiple results: ' + selector + ' ' + text);
  }
  else if (results.length === 0) {
    return null;
  }
  return results.at(0);
}

export const mocks = Object.freeze({
  $t: x => x,
  $kaanna: x => x ? x.fi : 'kaanna',
  $sd: x => x,
  $ld: x => x,
  $sdt: x => x,
}) as any;

export const stubs = Object.freeze({
  RouterLink: true,
  EpPdfLink: true,
}) as any;

export function wrap<T extends object>(original: T, value: T) {
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

type Constructable<T> = new(...params: any[]) => T;

/**
 * Mocks given store.
 *
 * @returns {undefined}
 */
export function mock<T>(X: Constructable<T>, overrides: Partial<T> = {}): T {
  const mocks: any = new X();
  for (const key of _.keys(X.prototype)) {
    mocks[key] = jest.fn();
  }
  return {
    ...mocks,
    ...overrides,
  };
}

// export class TestStore<T> extends T {
//   public get state() {
//     return (this as any).state;
//   }
// }
// export function exposed<T>() {
//   return new TestStore<T>();
// }
