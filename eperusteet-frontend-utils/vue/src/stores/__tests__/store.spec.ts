import { Store, Getter, Mutation, Action, State } from '../store';

interface SomeData {
  foo: string;
  bar?: number;
}

describe('Store annotations', () => {
  @Store
  class SomeDataStore {
    @State({
      mutationName: 'CustomSetterMutationName',
    })
    public name = 'abc';

    @State()
    public data: SomeData = {
      foo: 'bar',
    };

    public getStore() {
      return (SomeDataStore as any).store;
    }

    @Getter((state) => state.data.foo + state.data.bar || 42)
    public readonly foobar!: any;

    @Mutation({
      name: 'CustomMutation',
    })
    public customMutation(name: string) {
      this.name = name;
    }

    @Mutation()
    public dostuff(a: number, value: string) {
      this.data.bar = a;
      this.data.foo = value;
    }
  }

  const store = new SomeDataStore();

  beforeEach(() => {
    store.data = {
      foo: 'bar',
    };
  });

  test('initializes', async () => {
    expect(store.data).toEqual({
      foo: 'bar',
    });
  });

  test('Support multiple instances with own state', async () => {
    const a = new SomeDataStore();
    const b = new SomeDataStore();

    expect(a.data).toEqual({ foo: 'bar' });

    a.data = {
      foo: 'foo',
    };

    expect(a.data).toEqual({ foo: 'foo' });
    expect(b.data).toEqual({ foo: 'bar' });
  });

  test('has automatic setter mutation support', async () => {
    const s = new SomeDataStore();
    (s as any).store.commit('SOME_DATA_STORE_SET_DATA', { foo: 'x' });
    expect(s.data).toEqual({ foo: 'x' });
  });

  test('has automatic setter mutation support as setters', async () => {
    store.data = { foo: 'bar2' };
    expect(store.data).toEqual({ foo: 'bar2' });
  });

  test('has mutation support with custom functions', async () => {
    (store as any).store.commit('CustomMutation', ['zxc']);
    expect(store.name).toEqual('zxc');
    store.customMutation('1');
    expect(store.name).toEqual('1');
  });

  test('has mutation support', async () => {
    (store as any).store.commit('SOME_DATA_STORE_DOSTUFF', [43, 'z']);
    expect(store.data).toEqual({ bar: 43, foo: 'z' });
    (store as any).store.commit('CustomSetterMutationName', 'qwe');
    expect(store.name).toEqual('qwe');
  });

  test('has getter support', async () => {
    store.data = {
      foo: 'a',
      bar: 10,
    };

    expect(store.foobar).toEqual('a10');
  });

  test('mutations should be functions', () => {
    expect(() => Mutation()({}, 'value', {
      value: 'some string',
    })).toThrowError(/should be a function/);
  });

  test('actions should be functions', () => {
    expect(() => Action()({}, 'value', {
      value: 'some string',
    })).toThrowError(/should be a function/);
  });

  test('actions', () => {
    expect(() => Action()({}, 'value', {
      value: () => 5,
    })).not.toThrow();
  });
});

describe('Store', () => {
  test('multiple getters', () => {
    let foos = 0;
    let seconds = 0;
    let thirds = 0;

    @Store
    class MultipleGetters {
      @State() public data = 0;

      @Getter(() => {
        ++foos;
        return 42;
      })
      public readonly foo!: number;

      @Getter((state, getters) => {
        ++seconds;
        return getters.foo * 2;
      })
      public readonly second!: number;

      @Getter((state, getters) => {
        ++thirds;
        return getters.second * (state.data || 0);
      })
      public readonly third!: number;
    }

    const mg = new MultipleGetters();

    expect(mg.foo).toEqual(42);
    expect(mg.second).toEqual(84);
    expect(mg.data).toEqual(0);

    expect(foos).toEqual(1);
    expect(seconds).toEqual(1);
    expect(thirds).toEqual(0);

    mg.data = 1;
    expect(mg.third).toEqual(84);

    expect(foos).toEqual(1);
    expect(seconds).toEqual(1);
    expect(thirds).toEqual(1);
  });
});
