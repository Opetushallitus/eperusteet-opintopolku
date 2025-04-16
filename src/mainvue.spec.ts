import { mount } from '@vue/test-utils';
import { rootConfig } from './mainvue';

describe('Main', () => {
  test('Construction', async () => {

    const wrapper = mount(rootConfig);

    console.log(wrapper.html());

    expect(rootConfig).toBeTruthy();
  });
});
