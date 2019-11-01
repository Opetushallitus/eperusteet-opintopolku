import { mount, createLocalVue } from '@vue/test-utils';
import App from './App.vue';
import { delay } from '@shared/utils/delay';
import { mocks, stubs } from '@shared/utils/jestutils';


describe('App', () => {
  const localVue = createLocalVue();

  test('Renders', async () => {
    const hide = jest.fn();
    const show = jest.fn(() => {
      return {
        hide,
      };
    });
    const wrapper = mount(App as any, {
      localVue,
      stubs: {
        ...stubs,
        RouterView: true,
        notifications: true,
      },
      mocks: {
        ...mocks,
        $loading: {
          show,
        },
      },
    });

    await localVue.nextTick();
    expect(show).toHaveBeenCalledTimes(1);
    await delay(1000);
    expect(hide).toHaveBeenCalledTimes(1);
  });

});


