import { Configuration } from '@/generated/eperusteet/configuration';
import axios, { AxiosInstance } from 'axios';
import _ from 'lodash';
import {
  PerusteetApi,
  TiedotteetApi,
} from '@/generated/eperusteet/api';

const basePath = '';
export const baseURL = '/eperusteet-service/api';

const ax = axios.create({
  baseURL,
});

function axiosHandler(msg: string) {
  return async (err: any) => {
    console.error(msg as any, err);
    throw err;
  };
}

function successfulResponseHandler() {
  return async (res: any) => {
    return res;
  };
}

ax.interceptors.request.use(_.identity, axiosHandler('Request error'));
ax.interceptors.response.use(successfulResponseHandler(), axiosHandler('Response error'));

// https://github.com/Microsoft/TypeScript/issues/20719
type BaseAPIConstructor<T> = new(configuration?: Configuration, basePath?: string, axios?: AxiosInstance) => T;

const configuration = { basePath };

function initApi<T>(X: BaseAPIConstructor<T>): T {
  return new X(configuration, basePath, ax);
}

export const Api = ax;
export const Perusteet = initApi(PerusteetApi);
export const Tiedotteet = initApi(TiedotteetApi);
