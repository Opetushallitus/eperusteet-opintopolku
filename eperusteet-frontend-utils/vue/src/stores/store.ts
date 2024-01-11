import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'lodash';

Vue.use(Vuex);
const StoreConfigFieldName = '_storeconfig';

type StoreConstructor = new(...args: any[]) => {};

function vuexCase(val: string) {
  return _.toUpper(_.snakeCase(val));
}

function overrideMutations(store: any, config: any, target: any) {
  _.forEach(config.mutations, (v, k) => {
    Object.defineProperty(target, v.key, {
      enumerable: false,
      value: (...payload: any[]) => {
        store.commit(k, payload);
      },
    });
  });
}

function overrideGetters(store: any, config: any, target: any) {
  _.forEach(config.getters, (fn, k) => {
    Object.defineProperty(target, k, {
      enumerable: true,
      get() {
        return store.getters[k];
      },
    });
  });
}

function overrideStates(store: any, config: any, target: any) {
  _.forEach(config.state, (v, k) => {
    const ClassName = Object.getPrototypeOf(target.constructor.prototype).constructor.name;
    const mutationName = vuexCase(ClassName) + '_SET_' + vuexCase(k);
    Object.defineProperty(target, k, {
      enumerable: true,
      configurable: false,
      // Only for initial configuration
      get() {
        return store.state[k];
      },
      set(newValue) {
        store.commit(mutationName, newValue);
      },
    });
  });
}

function vuexBaseConfig(config: any) {
  return {
    namespaced: true,
    strict: process.env.NODE_ENV !== 'production',
    state: config.state,
    mutations: {
      ...config.stateSetters,
      ..._.mapValues(config.mutations, ({ value }) =>
        (state: any, payload: any) =>
          value.apply(state, payload)),
    },
    getters: {
      ..._.mapValues(config.getters,
        (fn, key) =>
          (state: any, getters: any) =>
            fn(state, getters)),
    },
  };
}

export function Store<T extends StoreConstructor>(constructor: T) {
  return class StoreBase extends constructor {
    private store: any;

    constructor(...args: any[]) {
      super(...args);
      const ClassName = Object.getPrototypeOf(this.constructor.prototype).constructor.name;
      const config = (this as any)._storeconfig;

      if (!this.store) {
        this.store = new Vuex.Store(_.cloneDeep(vuexBaseConfig(config)));
        overrideGetters(this.store, config, this);
        overrideStates(this.store, config, this);
        overrideMutations(this.store, config, this);
      }
    }
  };
}

function targetStoreConfig(target: object): any {
  if (!(target as any)[StoreConfigFieldName]) {
    Object.defineProperty(target, StoreConfigFieldName, {
      enumerable: false,
      writable: false,
      configurable: false,
      value: {
        state: {},
        stateSetters: {},
        mutations: {},
        getters: {},
        actions: {},
        plugins: [],
      },
    });
  }
  return (target as any)[StoreConfigFieldName];
}

export interface StateConfig {
  mutationName?: string;
}

export function State(config?: StateConfig) {
  return (target: object, key: string) => {
    const storeconfig = targetStoreConfig(target);
    const mutationName = (config && config.mutationName)
      || vuexCase(target.constructor.name) + '_SET_' + vuexCase(key);

    // Initial configuration property
    Object.defineProperty(target, key, {
      enumerable: true,
      configurable: false,

      // Only for initial configuration
      set(newValue) {
        storeconfig.state[key] = newValue;
      },
      get() {
        return storeconfig.state[key];
      },
    });

    // Add default mutation
    storeconfig.stateSetters[mutationName]
      = (state: any, value: any) => {
        state[key] = value;
      };
  };
}

export interface MutationConfig {
  name?: string;
}

export function Mutation(config?: MutationConfig) {
  return (target: any, key: string, descriptor: any) => {
    const fn = descriptor.value;

    if (!_.isFunction(fn)) {
      throw new Error(`Mutation method should be a function: ${key}`);
    }

    const mutationName = (config && config.name)
      || vuexCase(target.constructor.name) + '_' + vuexCase(key);
    targetStoreConfig(target).mutations[mutationName] = {
      key,
      value: fn,
    };
  };
}

export function Getter(fn: (state: any, getters: any) => any) {
  return (target: object, key: string) => {
    if (!_.isFunction(fn)) {
      throw new Error(`Getter should be a function: ${key}`);
    }
    targetStoreConfig(target as any).getters[key] = fn;
  };
}

export function Action() {
  return (target: any, key: string, descriptor: any) => {
    if (!_.isFunction(descriptor.value)) {
      throw new Error(`Mutation method should be a function: ${key}`);
    }
  };
}
