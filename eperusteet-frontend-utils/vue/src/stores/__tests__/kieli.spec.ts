import { createLocalVue } from '@vue/test-utils';
import { Kieli } from '../../tyypit';
import VueI18n from 'vue-i18n';
import { Kielet } from '../kieli';
import _ from 'lodash';
import { Kaannos } from '../../plugins/kaannos';

describe('Kielet', () => {
  const localVue = createLocalVue();
  localVue.use(VueI18n);
  Kielet.install(localVue);
  localVue.use(new Kaannos());
  const i18n = Kielet.i18n;

  beforeEach(() => {
    i18n.locale = Kieli.fi;
    Kielet.setSisaltoKieli(Kieli.fi);
  });

  test('UI-kieli', async () => {
    expect(Kielet.getUiKieli.value).toEqual(i18n.locale);
    i18n.locale = Kieli.sv;
    expect(Kielet.getUiKieli.value).toEqual(i18n.locale);
  });

  test('Sisältökieli', async () => {
    expect(Kielet.getSisaltoKieli.value).toEqual(Kieli.fi);
    expect(Kielet.sisaltoKieli.value).toEqual(Kieli.fi);

    Kielet.setSisaltoKieli(Kieli.sv);
    expect(Kielet.getSisaltoKieli.value).toEqual(Kieli.sv);
    expect(Kielet.sisaltoKieli.value).toEqual(Kieli.sv);
  });

  test('Ui käännökset', async () => {
    await Kielet.load({
      fi: [{
        key: 'kieli-sisalto',
        value: 'suomeksi',
      }],
      sv: [{
        key: 'kieli-sisalto',
        value: 'ruotsiksi',
      }],
    });

    expect(i18n.t('kieli-sisalto')).toEqual('suomeksi');
    i18n.locale = Kieli.sv;
    expect(i18n.t('kieli-sisalto')).toEqual('ruotsiksi');
  });

  test('Käännösten lataus', async () => {
    await Kielet.load({
      fi: [{
        key: 'testiavain',
        value: 'testiarvo',
      }],
      sv: [],
    });

    expect(i18n.t('testiavain')).toEqual('testiarvo');
  });

  test('Käännösten lataus virheellisillä arvoilla', async () => {
    await Kielet.load({
      fi: [{
        key: 'testiavain',
        value: 'testiarvo',
      }],
      sv: [{
        value: 'testiarvo',
      }, {
        key: 'testiavain',
      }] as any[],
    });

    expect(i18n.t('testiavain')).toEqual('testiarvo');
  });

  test('Oletuskäännökset', async () => {
    expect(localVue.prototype.$kaanna({ fi: 'suomeksi' })).toEqual('suomeksi');
    expect(localVue.prototype.$kaanna({ })).toEqual('');
    expect(localVue.prototype.$kaanna({ sv: 'ei suomeksi' })).toEqual('[ei suomeksi]');
    expect(localVue.prototype.$kaanna({ sv: 'ei suomeksi' }, true)).toEqual('');
  });
});
