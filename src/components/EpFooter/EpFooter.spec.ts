import { mount } from '@vue/test-utils';
import EpFooter from './EpFooter.vue';
import { Kielet } from '@shared/stores/kieli';
import { mocks, stubs } from '@shared/utils/jestutils';
import VueI18n from 'vue-i18n';
import { Kaannos } from '@shared/plugins/kaannos';
import { nextTick } from 'vue';
import { globalStubs } from '@shared/utils/__tests__/stubs';

describe('EpFooter', () => {
  test('Renders', async () => {
    const wrapper = mount(EpFooter as any, {
      global: {
        ...globalStubs,
      },
    });

    nextTick();
    expect(wrapper.html()).toMatchSnapshot();
  });
});
