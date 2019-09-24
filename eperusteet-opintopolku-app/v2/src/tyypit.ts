export enum Kieli {
  fi = 'fi',
  sv = 'sv',
  se = 'se',
  ru = 'ru',
  en = 'en',
}

export interface SovellusVirhe {
  path?: string;
  err?: string;
  state?: object;
  info?: string;
}
