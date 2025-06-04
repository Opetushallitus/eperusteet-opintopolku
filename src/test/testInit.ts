import { vi } from 'vitest';
import { useRoute } from 'vue-router';

vi.mock('@/stores/PerusteCacheStore', () => ({
  getCachedPerusteStore: vi.fn(),
  usePerusteCacheStore: vi.fn(),
}));

vi.mock('@/stores/PerusteenOsaStore', () => ({
  createPerusteOsaStore: vi.fn(),
}));

vi.mock('@/stores/OpetussuunnitelmaCacheStore', () => ({
  getCachedOpetussuunnitelmaStore: vi.fn(),
}));

vi.mock('vue-router', () => ({ useRoute: vi.fn(), useRouter: vi.fn() }));
vi.mocked(useRoute).mockReturnValue({ params: {} } as any);
