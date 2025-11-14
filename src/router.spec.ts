import { describe, it, expect, vi } from 'vitest';
import { router } from './router';

// Mock necessary modules that router might depend on
vi.mock('@shared/stores/virheet', () => ({
  Virheet: {
    onError: vi.fn(),
  },
}));

describe('Router', () => {
  it('Construction', async () => {
    expect(router).toBeTruthy();
  });
});
