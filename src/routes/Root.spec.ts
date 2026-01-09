import { mount } from '@vue/test-utils';
import Root from './Root.vue';
import { expect, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { globalStubs } from '../../eperusteet-frontend-utils/vue/src/utils/__tests__/stubs';

vi.mock('vue-router', () => (
  {
    useRoute: () => ({ fullPath: '/' }),
    useRouter: vi.fn(),
  }));
  
describe('Root', () => {

  beforeEach(() => {
    setActivePinia(createPinia());
  });

  test('Renders', async () => {
    const wrapper = mount(Root as any, {
      global: {
        ...globalStubs,
      },
    });

    expect(wrapper).toBeTruthy();
  });
});
