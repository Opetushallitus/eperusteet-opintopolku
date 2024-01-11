import { Kielet } from '@shared/stores/kieli';

export function rakenneNodecolor(node, parentMandatory, el) {
  const isRyhma = !!node.rooli;

  if (isRyhma) {
    const mapped = RooliToTheme[node.rooli];
    if (mapped) {
      return ColorMap[mapped];
    }
    if (node.rooli === 'määritelty') {
      if (node.nimi[Kielet.getUiKieli.value] === el.$t('rakenne-moduuli-pakollinen')) {
        return ColorMap.pakollinen;
      }
      else if (node.nimi[Kielet.getUiKieli.value] === el.$t('rakenne-moduuli-ammatilliset')) {
        return ColorMap.ammatilliset;
      }
      else if (node.nimi[Kielet.getUiKieli.value] === el.$t('rakenne-moduuli-yhteiset')) {
        return ColorMap.yhteiset;
      }
    }
    return ColorMap.valinnainen;
  }
  else {
    if (parentMandatory || node.pakollinen) {
      return ColorMap.pakollinen;
    }
    else {
      return ColorMap.valinnainen;
    }
  }
}

export const RooliToTheme = Object.freeze({
  'määrittelemätön': 'paikalliset',
  'osaamisala': 'osaamisala',
  'tutkintonimike': 'tutkintonimike',
  'vieras': 'yhteiset',
});

export const ColorMap = Object.freeze({
  ammatilliset: '#b2b2b2',
  osaamisala: '#575757',
  paikalliset: '#c126b8',
  pakollinen: '#bdeaa1',
  tutkintonimike: '#99b3f1',
  valinnainen: '#e60895',
  yhteiset: '#878787',
});
