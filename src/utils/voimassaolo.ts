const voimassaoloTietoTekstit = {
  'tuleva': 'voimaantulo',
  'voimassa': 'voimaantulo',
  'siirtyma': 'siirtymaajan-paattymisaika',
  'siirtymaPaattynyt': 'siirtymaajan-paattymisaika',
  'voimassaoloPaattynyt': 'voimassaolo-paattynyt',
};

export interface VoimassaoloTieto {
  tyyppi: 'tuleva' | 'voimassa' | 'siirtyma' | 'voimassaoloPaattynyt' | 'siirtymaPaattynyt';
  teksti: string;
  paiva: number;
}

interface VoimassaoloTietue {
  voimassaoloAlkaa: number;
  voimaantulo: number;
  siirtymaPaattyy: number;
  voimassaoloLoppuu: number;
}

export function voimassaoloTieto(tietue: VoimassaoloTietue): VoimassaoloTieto[] {
  const voimassaoloAlkaa = tietue.voimassaoloAlkaa || tietue.voimaantulo;
  const maxLoppuminen = tietue.siirtymaPaattyy || tietue.voimassaoloLoppuu || new Date(8640000000000000).getTime();

  if (voimassaoloAlkaa > new Date().getTime()) {
    return [{
      tyyppi: 'tuleva',
      teksti: voimassaoloTietoTekstit['tuleva'],
      paiva: voimassaoloAlkaa,
    }];
  }
  else if (tietue.siirtymaPaattyy !== null && tietue.voimassaoloLoppuu != null
            && tietue.siirtymaPaattyy > new Date().getTime() && tietue.voimassaoloLoppuu < new Date().getTime()) {
    return [{
      tyyppi: 'siirtyma',
      teksti: voimassaoloTietoTekstit['siirtyma'],
      paiva: tietue.siirtymaPaattyy,
    },
    {
      tyyppi: 'voimassa',
      teksti: voimassaoloTietoTekstit['voimassa'],
      paiva: voimassaoloAlkaa,
    }];
  }
  else if (voimassaoloAlkaa < new Date().getTime() && maxLoppuminen > new Date().getTime()) {
    return [{
      tyyppi: 'voimassa',
      teksti: voimassaoloTietoTekstit['voimassa'],
      paiva: voimassaoloAlkaa,
    }];
  }
  else if (maxLoppuminen < new Date().getTime()) {
    return [{
      tyyppi: tietue.siirtymaPaattyy != null ? 'siirtymaPaattynyt' : 'voimassaoloPaattynyt',
      teksti: voimassaoloTietoTekstit[tietue.siirtymaPaattyy != null ? 'siirtymaPaattynyt' : 'voimassaoloPaattynyt'],
      paiva: maxLoppuminen,
    }];
  }
  else {
    return [{
      tyyppi: 'voimassa',
      teksti: voimassaoloTietoTekstit['voimassa'],
      paiva: voimassaoloAlkaa,
    }];
  }
}
