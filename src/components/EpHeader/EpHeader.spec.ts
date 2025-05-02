import { mount } from '@vue/test-utils';
import Vue from 'vue';
import EpHeader from './EpHeader.vue';
import { globalStubs } from '@shared/utils/__tests__/stubs';
import { nextTick } from 'vue';

describe('EpHeader', () => {

  test('Renders spinners and data', async () => {
    const propsData = {
      murupolku: [] as any[],
      koulutustyyppi: undefined,
    };

    const wrapper = mount(EpHeader as any, {
      props: propsData,
      global: {
        ...globalStubs,
      },
    });

    expect(wrapper.html()).toContain('home');

    await wrapper.setProps({ murupolku: [{
      label: 'parent-jolla-todella-pitka-teksti',
      location: { name: 'root' },
    }] });

    nextTick();

    expect(wrapper.html()).toContain('home');
    expect(wrapper.html()).toContain('parent-jolla-todella-pitka-teksti');

    await wrapper.setProps({ murupolku: [
      {
        label: 'parent-jolla-todella-pitka-teksti',
        location: { name: 'root' },
      },
      {
        label: 'uusi-alikappale',
        location: { name: 'root' },
      },
    ]});

    nextTick();

    expect(wrapper.html()).toContain('home');
    expect(wrapper.html()).toContain('parent-jolla-todella-pitka-teksti');
    expect(wrapper.html()).toContain('uusi-alikappale');
  });
});
