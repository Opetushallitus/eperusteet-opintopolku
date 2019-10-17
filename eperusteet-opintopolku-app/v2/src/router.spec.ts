import { mount, createLocalVue } from '@vue/test-utils';
import { router } from './router';


describe('Router', () => {
  test('Construction', async () => {
    expect(router).toBeTruthy();
  });
});
