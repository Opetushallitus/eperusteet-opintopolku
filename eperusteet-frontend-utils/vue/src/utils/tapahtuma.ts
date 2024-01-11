import * as _ from 'lodash';

const oletusKohdereititys = {
  viite: 'tekstikappale',
  opetussuunnitelma: 'opsTiedot',
  opetussuunnitelma_rakenne: 'jarjesta',
  poppiaine: 'paikallinenOppiaine',
  opintojakso: 'opintojakso',
  termi: 'opsKasitteet',
};

const perusteKohdeReititys = {
  termi: 'kasitteet',
  kvliite: 'kvliite',
  tutkinnonosa: 'tutkinnonosa',
  tekstikappale: 'tekstikappale',
  osaalue: 'osaalue',
  tutkinnon_muodostuminen: 'muodostuminen',
  koulutuksenosa: 'koulutuksenosa',
  aipe_laajaalainenosaaminen: 'aipelaajaAlainenOsaaminen',
  aipevaihe: 'aipevaihe',
  aipekurssi: 'aipekurssi',
  aipeoppiaine: 'aipeoppiaine',
  oppiaine: 'perusopetusoppiaine',
  perusopetuslaajaalainenosaaminen: 'perusopetusLaajaAlainenOsaaminen',
  vuosiluokkakokonaisuus: 'perusopetusVuosiluokkakokonaisuus',
};

const opasKohdeReititys = {
  termi: 'opasKasitteet',
};

const tyypitettyReititys = {
  'ops': { ...oletusKohdereititys },
  'normaali': { ...oletusKohdereititys, ...perusteKohdeReititys },
  'pohja': { ...oletusKohdereititys, ...perusteKohdeReititys },
  'opas': { ...oletusKohdereititys, ...opasKohdeReititys },
};

const kohdereititysId = {
  viite: 'osaId',
  poppiaine: 'paikallinenOppiaineId',
  opintojakso: 'opintojaksoId',
};

const perusteKohdereititysId = {
  viite: 'tekstiKappaleId',
  tutkinnonosa: 'tutkinnonOsaId',
  tekstikappale: 'tekstiKappaleId',
  osaalue: 'osaalueId',
  koulutuksenosa: 'koulutuksenosaId',
  aipe_laajaalainenosaaminen: 'laoId',
  aipevaihe: 'vaiheId',
  aipekurssi: 'kurssiId',
  aipeoppiaine: 'oppiaineId',
  oppiaine: 'oppiaineId',
  perusopetuslaajaalainenosaaminen: 'laoId',
  vuosiluokkakokonaisuus: 'vlkId',
};

const tyypitettyKohdereititysId = {
  'ops': { ...kohdereititysId },
  'normaali': { ...kohdereititysId, ...perusteKohdereititysId },
  'pohja': { ...kohdereititysId, ...perusteKohdereititysId },
  'opas': { ...kohdereititysId, ...perusteKohdereititysId },
};

const kohdeIcon = {
  viite: 'edit',
  opetussuunnitelma: 'article',
  opetussuunnitelma_rakenne: 'low_priority',
  termi: 'book',
  kommentti: 'comment',
};

const tapahtumaIcon = {
  paivitys: 'edit',
  luonti: 'add',
  poisto: 'delete',
  palautus: 'undo',
  julkaisu: 'check_circle',
  jarjestetty: 'reorder',
};

const poistetutTabIndices = {
  opintojakso: 0,
  poppiaine: 1,
  viite: 2,
};

export function muokkaustietoRoute(id, kohde, tapahtuma, tyyppi = 'ops', lisaparametrit?) {
  if (tapahtuma === 'poisto') {
    return {
      name: 'opsPoistetut',
      params: {
        tabIndex: poistetutTabIndices[kohde],
      },
    };
  }

  const tyypinReititys = tyypitettyReititys[tyyppi] || tyypitettyReititys['ops'];
  const tyypinKohdereititysId = tyypitettyKohdereititysId[tyyppi] || tyypitettyKohdereititysId['ops'];

  const router = {
    name: tyypinReititys[kohde],
    params: {},
  };

  if (tyypinKohdereititysId[kohde]) {
    router.params[tyypinKohdereititysId[kohde]] = id;
  }

  if (lisaparametrit) {
    _.forEach(lisaparametrit, lisaparametri => {
      router.params[tyypinKohdereititysId[lisaparametri.kohde]] = lisaparametri.kohdeId;
    });
  }

  return router;
}

export function muokkaustietoIcon(kohde, tapahtuma) {
  if (kohde === 'kommentti' || kohde === 'opetussuunnitelma_rakenne') {
    return kohdeIcon[kohde];
  }

  return tapahtumaIcon[tapahtuma] ? tapahtumaIcon[tapahtuma] : 'question_mark';
}
