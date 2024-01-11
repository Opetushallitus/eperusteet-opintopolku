import { Notifikaatiot } from './notifikaatiot';

describe('Notifikaatiot plugin', () => {
  const v = {
    prototype: {
      $notify: jest.fn(),
    },
  } as any;

  Notifikaatiot.install(v as any);
  const n = new Notifikaatiot();

  test('methods', () => {
    v.prototype.$success('a');
    v.prototype.$info('b');
    v.prototype.$fail('c');
    expect(v.prototype.$notify).toHaveBeenCalledTimes(3);
  });
});
