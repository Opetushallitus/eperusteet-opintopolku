import _ from 'lodash';
import { Kielet } from '@shared/stores/kieli';
import { osaToLocation } from '@shared/utils/NavigationBuilder';

export interface Tulos {
  [key: string]: Tulos | any;
  osanTyyppi?: string;
};

export type Haettava = Tulos[] | Tulos;

const MatchFields = [
  'fi',
  'sv',
  'en',
];

export const typeSort = {
  otsikko: 1,
  sisalto: 2,
};

const clearEl = document.createElement('div');

function queryMatch(target, query: string) {
  clearEl.innerHTML = target;
  return _.includes(_.toLower(clearEl.innerText), _.toLower(query));
}

function applyLocationTag(target: string, query: string) {
  clearEl.innerHTML = target;
  const idx = _.toLower(clearEl.innerText).indexOf(_.toLower(query));
  let start = idx - 50;
  start = start < 0 ? 0 : start;
  const end = start + 200;
  const text
    = (start > 0 ? '...' : '')
    + clearEl.innerText.substring(start, end)
      .trimStart()
      .trimEnd()
    + (end < clearEl.innerText.length - 1 ? '...' : '');

  return _.replace(text, new RegExp(query, 'gi'), (match) => `<span class="font-weight-bold">${match}</span>`);
}

export function deepFind(target: any, path: any[], results: any[], query: string): any[] {
  let result = [] as any[];

  if (_.isArray(target)) {
    for (const next of target) {
      result = [...result, ...deepFind(next, path, results, query)];
    }
  }
  else if (_.isObject(target)) {
    for (const key of _.sortBy(_.keys(target), (key) => keyPriority()[key] || 100)) {
      const next = target[key];
      if (_.isString(next) && _.includes(MatchFields, key) && queryMatch(next, query)) {
        result = [...result, applyLocationTag(next, query)];
      }
      else {
        const nested = deepFind(
          target[key],
          [...path, target],
          results,
          query);
        result = [...result, ...nested];
      }
    }

    const osanTyyppi = _.get(target, 'perusteenOsa.osanTyyppi');
    const targetName = _.get(target, 'perusteenOsa.nimi.' + Kielet.getUiKieli.value);

    if (targetName && queryMatch(targetName, query)) {
      results.push({
        path,
        osanTyyppi,
        target,
        result,
        location: osaToLocation(target as any),
        type: 'otsikko',
      });
      return [];
    }

    if (osanTyyppi && !_.isEmpty(result)) {
      results.push({
        path,
        osanTyyppi,
        target,
        result,
        location: osaToLocation(target as any),
        type: 'sisalto',
      });
      return [];
    }
  }

  return result;
}

const keyPriority = () => {
  return {
    fi: 10,
    sv: Kielet.getUiKieli.value === 'sv' ? 5 : 20,
    en: Kielet.getUiKieli.value === 'en' ? 5 : 30,
  };
};
