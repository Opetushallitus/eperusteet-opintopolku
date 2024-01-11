export const aikataulutapahtuma = Object.freeze({
  luominen: 'luominen',
  lausuntokierros: 'lausuntokierros',
  johtokunnankasittely: 'johtokunnankasittely',
  arvioitujulkaisupaiva: 'arvioitujulkaisupaiva',
  julkaisu: 'julkaisu',
  tavoite: 'tavoite',
});

export const aikataulutapahtumaSort = Object.freeze({
  'luominen': 1,
  'lausuntokierros': 2,
  'johtokunnankasittely': 3,
  'arvioitujulkaisupaiva': 4,
  'julkaisu': 5,
  'tavoite': 6,
});

export function aikatauluTapahtumaSort(aikataulu: any) {
  return aikataulutapahtumaSort[aikataulu.tapahtuma];
}

export function aikatauluTapahtumapaivaSort(aikataulu: any) {
  return aikataulu.tapahtumapaiva;
}

export interface Tapahtuma {
  id?: number;
  tapahtuma: 'luominen' | 'julkaisu' | 'tavoite' | 'lausuntokierros' | 'johtokunnankasittely' | 'arvioitujulkaisupaiva';
  tapahtumapaiva: Date;
  tavoite: string | { [key: string]: string; };
}

export interface AikatauluRootModel {
  luotu: Date;
}
