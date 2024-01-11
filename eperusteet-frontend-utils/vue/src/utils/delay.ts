import * as _ from 'lodash';
import Vue from 'vue';
import VueCompositionApi, { computed } from '@vue/composition-api';

Vue.use(VueCompositionApi);

/**
 * Asyncronic debounce that supports awaiting. Useful when need to wait
 * for the actual event to happen.
 *
 * @param {async function} fn Function to be called after debounce
 * @param {number} ms Time to wait in milliseconds
 * @returns {Promise} Is resolved after the actual debounce function runs
 */
export function asyncDebounce<T, F>(fn: F & any, ms: number): F & any {
  let tid = null as number | null;
  const wrapper = function(this: any, ...params: any[]) {
    if (_.isNumber(tid)) {
      clearTimeout(tid);
    }
    const self = this;
    return new Promise((resolve, reject) => {
      tid = setTimeout(async () => {
        tid = null;
        try {
          const bound = fn.bind(self);
          resolve(await bound(params));
        }
        catch (err) {
          reject(err);
        }
      }, ms);
    });
  };
  return wrapper as unknown as F;
}

/**
 * Debounced that can be used for functions as a decorator.
 *
 * + Can be awaited
 * + Can be used in multiple instances of the same class
 *
 * @param {number} ms
 */
export function Debounced(ms = 300) {
  const debounces = new WeakMap();
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = async function(this: any, ...params: any[]) {
      if (debounces.has(this)) {
        clearTimeout(debounces.get(this));
      }
      return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV === 'test') {
          original.apply(this, params).then(resolve)
            .catch(reject);
        }
        else {
          debounces.set(this, setTimeout(() => {
            original.apply(this, params).then(resolve)
              .catch(reject);
            debounces.set(this, undefined);
          }, ms));
        }
      });
    };
  };
}

/**
 * Wraps a getter into a computed value
 */
export function Computed() {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    if (!_.isFunction(descriptor.get)) {
      throw new Error('descriptor must have a getter');
    }
    const original = descriptor.get;
    const getter = computed(() => original);
    descriptor.value = {
      get: getter.value,
    };
  };
}

/**
 * delay
 *
 * @param ms
 */
export async function delay(ms: number = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
