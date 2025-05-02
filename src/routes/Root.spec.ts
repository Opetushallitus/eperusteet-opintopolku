import { mount } from '@vue/test-utils';
import Root from './Root.vue';
import { expect, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { globalStubs } from '../../eperusteet-frontend-utils/vue/src/utils/__tests__/stubs';

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
  