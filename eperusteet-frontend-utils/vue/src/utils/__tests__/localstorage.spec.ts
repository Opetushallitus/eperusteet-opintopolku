import {
  setItem,
  getItem,
  removeItem,
} from '../localstorage';

describe('Localstorage', () => {
  test('Typed set/get/remove', () => {
    interface MySubType {
      value: number;
    }

    interface MyType {
      name: string;
      id: number;
      vals: MySubType[];
    }

    const val: MyType = {
      id: 42,
      name: 'foobar',
      vals: [{
        value: 5,
      }],
    };

    setItem('val', val);
    const val2 = getItem<typeof val>('val');
    expect(val2).toBeTruthy();

    if (val2) {
      expect(val2.name).toEqual('foobar');
      expect(val2.vals[0].value).toEqual(5);
      removeItem('val');
      expect(getItem('val')).toBeNull();
    }
  });
});
