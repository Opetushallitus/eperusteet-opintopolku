import { Lokalisointi } from '@shared/api/eperusteet';

export function highlight(nimi, query: string) {
  if (!query) {
    return nimi;
  }

  return (nimi || '').replace(new RegExp(query, 'ig'), (match) => '<mark>' + match + '</mark>');
}

export async function getKaannokset() {
  const [fi, sv, en] = _.map(await Promise.all(_.map(['fi', 'sv', 'en'], lang => Lokalisointi.getAllKaannokset(lang))), 'data');
  return { fi, sv, en } as any;
}
