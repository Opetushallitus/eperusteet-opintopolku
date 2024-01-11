import * as ylops from './ylops';
import * as eperusteet from './eperusteet';
import './common';
import axios from 'axios';

describe('Api', () => {
  test('Has caller id', () => {
    expect(axios.defaults.headers).toMatchSnapshot();
  });
});
