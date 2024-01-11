export interface KoulutustyyppiRyhmaValinta {
  type: string,
  object: string[],
};

export const julkaisupaikkaSort = {
  'opintopolku_etusivu': 1,
  'ops': 2,
  'lops': 3,
  'amosaa': 4,
  'vst': 5,
  'koto': 6,
};

export const julkaisupaikka = Object.freeze({
  opintopolku_etusivu: 'opintopolku_etusivu',
  ops: 'ops',
  lops: 'lops',
  amosaa: 'amosaa',
  vst: 'vst',
  tuva: 'tuva',
  koto: 'koto',
});

export function onkoUusi(aika) {
  const paiva = 1000 * 60 * 60 * 24;
  const paivaSitten = Date.now() - paiva;

  return aika > paivaSitten;
}
