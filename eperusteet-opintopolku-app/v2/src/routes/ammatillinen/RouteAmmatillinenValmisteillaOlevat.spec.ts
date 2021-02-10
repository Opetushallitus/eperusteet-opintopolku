import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import { Kielet } from '@shared/stores/kieli';
import { delay } from '@shared/utils/delay';
import { Kaannos } from '@shared/plugins/kaannos';
import VueI18n from 'vue-i18n';
import RouteAmmatillinenValmisteillaOlevat from './RouteAmmatillinenValmisteillaOlevat.vue';
import { ValmisteillaOlevatStore } from '@/stores/ValmisteillaOlevatStore';
import { mock, mocks, stubs } from '@shared/utils/jestutils';

Vue.use(BootstrapVue);

describe('RouteAmmatillinenValmisteillaOlevat component', () => {
  const localVue = createLocalVue();
  localVue.use(VueI18n);
  Kielet.install(localVue);
  localVue.use(new Kaannos());

  const valmisteillaOlevatStore = (perusteet) => {
    const storemock = mock(ValmisteillaOlevatStore);
    storemock.state.perusteet = {
      sivu: 0,
      sivuja: 1,
      sivukoko: 10,
      kokonaismäärä: 1,
      data: perusteet,
    } as any;
    return storemock;
  };

  test('Renders', async () => {
    const wrapper = mount(RouteAmmatillinenValmisteillaOlevat, {
      localVue,
      propsData: {
        valmisteillaOlevatStore: valmisteillaOlevatStore([]),
      },
      mocks: {
        $t: x => x,
        $sd: x => x,
        $sdm: x => x,
      },
      stubs: {
        fas: '<div />',
        'router-link': RouterLinkStub,
      },
    });

    expect(wrapper.html()).toBeTruthy();

    expect(wrapper.findAll('.valmisteilla-row')).toHaveLength(0);
  });

  test('valmisteilla data', async () => {
    const wrapper = mount(RouteAmmatillinenValmisteillaOlevat, {
      localVue,
      propsData: {
        valmisteillaOlevatStore: valmisteillaOlevatStore(
          [
            {
              id: 1,
              nimi: {
                fi: 'perustenimi',
              },
              voimassaoloAlkaa: 1613032868150,
              perusteenAikataulut: [
                {
                  id: 2,
                  tapahtumapaiva: 1613858400000,
                  tavoite: {
                    fi: 'tavoite1',
                  },
                  julkinen: true,
                },
                {
                  id: 3,
                  tapahtumapaiva: 1613858400000,
                  tavoite: {
                    fi: 'tavoite2',
                  },
                  julkinen: true,
                },
                {
                  id: 3,
                  tapahtumapaiva: 1613858400000,
                  tavoite: {
                    fi: 'tavoite2',
                  },
                  julkinen: false,
                },
              ],
            },
          ]),
      },
      mocks: {
        $t: x => x,
        $sd: x => x,
        $sdm: x => x,
      },
      stubs: {
        fas: '<div />',
        'router-link': RouterLinkStub,
      },
    });

    expect(wrapper.findAll('.valmisteilla-row')).toHaveLength(1);
    const valmisteilla = wrapper.findAll('.valmisteilla-row').at(0);
    expect(valmisteilla.html()).toContain('1613032868150');
    expect(valmisteilla.html()).toContain('nayta-aikataulu');

    valmisteilla.find('.avaa-link')
      .trigger('click');

    await localVue.nextTick();

    expect(valmisteilla).not.toContain('nayta-aikataulu');
    expect(valmisteilla.html()).toContain('piilota-aikataulu');

    expect(valmisteilla.findAll('.perusteen-aikataulu')).toHaveLength(2);
    const aikataulurivi1 = valmisteilla.findAll('.perusteen-aikataulu').at(0);
    expect(aikataulurivi1.html()).toContain('1613858400000');
    expect(aikataulurivi1.html()).toContain('tavoite1');
  });
});
