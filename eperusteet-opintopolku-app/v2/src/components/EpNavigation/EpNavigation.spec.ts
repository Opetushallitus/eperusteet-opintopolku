import { mount, createLocalVue } from '@vue/test-utils';
import EpNavigation from './EpNavigation.vue';
import { findAllContaining, findContaining, mocks, stubs, tiedoteStoreMock, perusteKoosteStoreMock } from '@/jestutils';
import { KieliStore } from '@shared/stores/kieli';


describe('EpNavigation', () => {
  const localVue = createLocalVue();
  KieliStore.setup(localVue);

  test('Renders spinners and data', async () => {

    const wrapper = mount(EpNavigation as any, {
      localVue,
      stubs: {
        ...stubs,
      },
      mocks: {
        ...mocks,
      },
    });

    await localVue.nextTick();
    const links = wrapper.contains;
    expect(findContaining(wrapper, 'a', 'esiopetus')).toBeTruthy();
    expect(findContaining(wrapper, 'a', 'lukiokoulutus')).toBeTruthy();
    expect(findContaining(wrapper, 'a', 'varhaiskasvatus')).toBeTruthy();
    expect(findAllContaining(wrapper, 'a', 'perusopetus').length).toBeGreaterThanOrEqual(1);
  });
});

