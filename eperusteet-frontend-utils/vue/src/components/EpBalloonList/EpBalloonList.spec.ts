import { mount, createLocalVue } from '@vue/test-utils';
import EpBalloonList from './EpBalloonList.vue';
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';

Vue.use(BootstrapVue);

describe.skip('EpBalloonList component', () => {
  const localVue = createLocalVue();

  test('Renders', async () => {
    const wrapper = mount(EpBalloonList, {
      localVue,
      // slot: {
      //   default: `<div>
      //     {{ item.id }}
      //   </div>`,
      // },
      propsData: {
        value: [],
      },
    });

    console.log(wrapper.html());
    console.log(wrapper.emitted().input);
  });
});
