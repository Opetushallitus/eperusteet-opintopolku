import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import EpKayttaja from './EpKayttaja.vue';
import { Kieli } from '../../tyypit';
import { Kaannos } from '../../plugins/kaannos';
import VueI18n from 'vue-i18n';
import { delay } from '../../utils/delay';
import { Kielet } from '../../stores/kieli';
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import EpCollapse from '../EpCollapse/EpCollapse.vue';

Vue.use(BootstrapVue);

describe('EpKayttaja component', () => {
  const localVue = createLocalVue();
  localVue.use(VueI18n);
  Kielet.install(localVue);
  localVue.use(new Kaannos());

  test('Renders', async () => {
    let currentRoute = {
      x: 42,
      params: {
        lang: 'fi',
      },
    };

    const wrapper = mount(EpKayttaja, {
      localVue,
      propsData: {
        tiedot: {
          kutsumanimi: 'etunimi',
          sukunimi: 'sukunimi',
        },
        sovellusOikeudet: [
          {
            eperusteSovellus:
              {
                sovellus: 'APP_EPERUSTEET',
                url: 'eperuste-url',
              },
            valittu: true,
          },
          {
            eperusteSovellus: {
              sovellus: 'APP_EPERUSTEET_AMOSAA',
              url: 'amosaa-url',
            },
            valittu: false,
          },
        ],
      },
      mocks: {
        $t: x => x,
        $router: {
          currentRoute,
          async push(route: any) {
            currentRoute = route;
          },
        },
      },
      stubs: {
        'router-link': RouterLinkStub,
      },
    });

    expect(wrapper.html()).toContain('etunimi sukunimi');
    expect(wrapper.find('.uikieli').html()).toContain('fi');
    wrapper.find(EpCollapse).trigger('click');
    await delay();
    await (wrapper.vm as any).valitseUiKieli(Kieli.sv);

    expect(currentRoute).toEqual({
      x: 42,
      params: {
        lang: 'sv',
      },
    });

    expect(wrapper.find('.valittu-sovellus').html()).toContain('APP_EPERUSTEET');
    wrapper.find('.valittu-sovellus').trigger('click');

    await delay();

    expect(wrapper.findAll(EpCollapse).at(1)
      .findAll('.sovellusoikeus').length).toBe(2);
    expect(wrapper.findAll(EpCollapse).at(1)
      .html()).toContain('amosaa-url');

    expect(wrapper.html()).toMatchSnapshot();
  });
});
