import { rootConfig } from './mainvue';


describe('Main', () => {
  test('Construction', async () => {
    expect(rootConfig).toBeTruthy();
  });
});
