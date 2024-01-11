import { axiosHandler, successfulResponseHandler } from './common';
import { Configuration,
  AikatauluApi,
  DokumentitApi,
  DokumentitApiAxiosParamCreator,
  KayttajatApi,
  KommentointiApi,
  KysymyksetApi,
  LiitetiedostotApi,
  LiitetiedostotApiAxiosParamCreator,
  Lops2019Api,
  Lops2019OpintojaksotApi,
  Lops2019OppiaineetApi,
  Lops2019PerusteControllerApi,
  MuokkaustietoApi,
  OhjeetApi,
  OpetussuunnitelmanSisaltoApi,
  OpetussuunnitelmatApi,
  OpetussuunnitelmatJulkisetApi,
  OppiaineenVuosiluokatApi,
  OppiaineenVuosiluokkakokonaisuudetApi,
  OppiaineetApi,
  TermistoApi,
  UlkopuolisetApi,
  VuosiluokkakokonaisuudetApi,
  PalautteetApi,
  LukioOpetussuunnitelmatApi,
  JulkaisutApi,
  LogoutApiAxiosParamCreator,
} from '../generated/ylops';
import axios, { AxiosInstance } from 'axios';
import _ from 'lodash';

import * as YlopsApi from '../generated/ylops';
import Qs from 'qs';
import { createLogger } from '../utils/logger';

export import OpetussuunnitelmaInfoDtoToteutusEnum = YlopsApi.OpetussuunnitelmaInfoDtoToteutusEnum;
export import OppiaineSuppeaDtoTyyppiEnum = YlopsApi.OppiaineSuppeaDtoTyyppiEnum;
export import UnwrappedOpsOppiaineDtoTyyppiEnum = YlopsApi.UnwrappedOpsOppiaineDtoTyyppiEnum;
export import NavigationNodeDtoTypeEnum = YlopsApi.NavigationNodeDtoTypeEnum;
export import OpetussuunnitelmaInfoDtoKoulutustyyppiEnum = YlopsApi.OpetussuunnitelmaInfoDtoKoulutustyyppiEnum;
export import OpetussuunnitelmaKevytDtoTilaEnum = YlopsApi.OpetussuunnitelmaKevytDtoTilaEnum;
export import OpetussuunnitelmaKevytDtoToteutusEnum = YlopsApi.OpetussuunnitelmaKevytDtoToteutusEnum;
export import OpetussuunnitelmanJulkaisuDtoTilaEnum = YlopsApi.OpetussuunnitelmanJulkaisuDtoTilaEnum;

const logger = createLogger('YlopsAxios');
const basePath = '';
export const baseURL = '/eperusteet-ylops-service/api';

axios.defaults.headers.common['Caller-Id'] = '1.2.246.562.10.00000000001.eperusteet';

const ax = axios.create({
  baseURL,
  paramsSerializer: params => Qs.stringify(params, { arrayFormat: 'repeat' }),
});

ax.interceptors.request.use(_.identity, axiosHandler('Request error'));
ax.interceptors.response.use(successfulResponseHandler(), axiosHandler('Response error'));

// https://github.com/Microsoft/TypeScript/issues/20719
type BaseAPIConstructor<T> = new(configuration?: Configuration, basePath?: string, axios?: AxiosInstance) => T;

const configuration = { basePath };

function initApi<T>(X: BaseAPIConstructor<T>): T {
  return new X(configuration, basePath, ax);
}

export const Api = ax;
export const Dokumentit = initApi(DokumentitApi);
export const DokumentitParams = DokumentitApiAxiosParamCreator(configuration);
export const Kayttajat = initApi(KayttajatApi);
export const LogoutParams = LogoutApiAxiosParamCreator(configuration);
export const Kommentointi = initApi(KommentointiApi);
export const Kysymykset = initApi(KysymyksetApi);
export const Liitetiedostot = initApi(LiitetiedostotApi);
export const LiitetiedostotParam = LiitetiedostotApiAxiosParamCreator(configuration);
export const Lops2019 = initApi(Lops2019Api);
export const Lops2019Perusteet = initApi(Lops2019PerusteControllerApi);
export const Ohjeet = initApi(OhjeetApi);
export const OpetussuunnitelmanSisalto = initApi(OpetussuunnitelmanSisaltoApi);
export const Opetussuunnitelmat = initApi(OpetussuunnitelmatApi);
export const OpetussuunnitelmatJulkiset = initApi(OpetussuunnitelmatJulkisetApi);
export const Opintojaksot = initApi(Lops2019OpintojaksotApi);
export const Lops2019Oppiaineet = initApi(Lops2019OppiaineetApi);
export const Termisto = initApi(TermistoApi);
export const Ulkopuoliset = initApi(UlkopuolisetApi);
export const Muokkaustieto = initApi(MuokkaustietoApi);
export const Aikataulu = initApi(AikatauluApi);
export const Vuosiluokkakokonaisuudet = initApi(VuosiluokkakokonaisuudetApi);
export const Oppiaineet = initApi(OppiaineetApi);
export const OppiaineenVuosiluokkakokonaisuudet = initApi(OppiaineenVuosiluokkakokonaisuudetApi);
export const OppiaineenVuosiluokat = initApi(OppiaineenVuosiluokatApi);
export const Palautteet = initApi(PalautteetApi);
export const LukioOpetussuunnitelmat = initApi(LukioOpetussuunnitelmatApi);
export const Julkaisut = initApi(JulkaisutApi);

Dokumentit.addImage = (opsId, tyyppi, kieli, formData) => {
  return Api.post('/dokumentit/kuva', formData, {
    params: {
      opsId,
      tyyppi,
      kieli,
    },
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const DokumenttiDtoTilaEnum = YlopsApi.DokumenttiDtoTilaEnum;
export type DokumenttiDto = YlopsApi.DokumenttiDto;
export type EtusivuDto = YlopsApi.EtusivuDto;
export type KayttajanTietoDto = YlopsApi.KayttajanTietoDto;
export type KoodistoKoodiDto = YlopsApi.KoodistoKoodiDto;
export type KysymysDto = YlopsApi.KysymysDto;
export type LiiteDto = YlopsApi.LiiteDto;
export type Lops2019LaajaAlainenOsaaminenKokonaisuusDto = YlopsApi.Lops2019LaajaAlainenOsaaminenKokonaisuusDto;
export type Lops2019ModuuliDto = YlopsApi.Lops2019ModuuliDto;
export type Lops2019OpintojaksoDto = YlopsApi.Lops2019OpintojaksoDto;
export type Lops2019OpintojaksonModuuliDto = YlopsApi.Lops2019OpintojaksonModuuliDto;
export type Lops2019OpintojaksonOppiaineDto = YlopsApi.Lops2019OpintojaksonOppiaineDto;
export type Lops2019OppiaineDto = YlopsApi.Lops2019OppiaineKaikkiDto;
export type Lops2019OppiaineKaikkiDto = YlopsApi.Lops2019OppiaineKaikkiDto;
export type Lops2019PaikallinenLaajaAlainenDto = YlopsApi.Lops2019PaikallinenLaajaAlainenDto;
export type Lops2019PaikallinenOppiaineDto = YlopsApi.Lops2019PaikallinenOppiaineDto;
export type Lops2019PoistettuDto = YlopsApi.Lops2019PoistettuDto;
export type KommenttiDto = YlopsApi.Kommentti2019Dto;
export type Matala = YlopsApi.Matala;
export type MuokkaustietoKayttajallaDto = YlopsApi.MuokkaustietoKayttajallaDto;
export type OhjeDto = YlopsApi.OhjeDto;
export type OpetussuunnitelmaDto = YlopsApi.OpetussuunnitelmaDto;
export type OpetussuunnitelmaInfoDto = YlopsApi.OpetussuunnitelmaInfoDto;
export type OpetussuunnitelmaJulkinenDto = YlopsApi.OpetussuunnitelmaJulkinenDto;
export type OpetussuunnitelmaKevytDto = YlopsApi.OpetussuunnitelmaKevytDto;
export type OpetussuunnitelmaLuontiDto = YlopsApi.OpetussuunnitelmaLuontiDto;
export type OpetussuunnitelmanAikatauluDto = YlopsApi.OpetussuunnitelmanAikatauluDto;
export type PerusteInfoDto = YlopsApi.PerusteInfoDto;
export type TekstiKappaleViiteDto = YlopsApi.TekstiKappaleViiteDto;
export type PoistettuTekstiKappaleDto = YlopsApi.PoistettuTekstiKappaleDto;
export type Puu = YlopsApi.Puu;
export type RevisionDto = YlopsApi.RevisionDto;
export type RevisionKayttajaDto = YlopsApi.RevisionKayttajaDto;
export type TekstiKappaleDto = YlopsApi.TekstiKappaleDto;
export type TekstiKappaleKevytDto = YlopsApi.TekstiKappaleKevytDto;
export type TekstiKappaleViitePerusteTekstillaDto = YlopsApi.TekstiKappaleViitePerusteTekstillaDto;
export type TermiDto = YlopsApi.TermiDto;
export type UusiJulkaisuDto = YlopsApi.UusiJulkaisuDto;
export type YlopsNavigationNodeDto = YlopsApi.NavigationNodeDto;
export type OpsVuosiluokkakokonaisuusKevytDto = YlopsApi.OpsVuosiluokkakokonaisuusKevytDto;
export type OppiaineenVuosiluokkaDto = YlopsApi.OppiaineenVuosiluokkaDto;
export type OpsVuosiluokkakokonaisuusDto = YlopsApi.OpsVuosiluokkakokonaisuusDto;
export type PerusteOppiaineenVuosiluokkakokonaisuusDto = YlopsApi.PerusteOppiaineenVuosiluokkakokonaisuusDto;
export type OpsOppiaineKevytDto = YlopsApi.OpsOppiaineKevytDto;
export type OppiaineSuppeaDto = YlopsApi.OppiaineSuppeaDto;
export type PerusteOppiaineDto = YlopsApi.PerusteOppiaineDto;
export type KopioOppimaaraDto = YlopsApi.KopioOppimaaraDto;
export type UnwrappedOpsVuosiluokkakokonaisuusDto = YlopsApi.UnwrappedOpsVuosiluokkakokonaisuusDto;
export type PerusteVuosiluokkakokonaisuusDto = YlopsApi.PerusteVuosiluokkakokonaisuusDto;
export type UnwrappedOpsOppiaineDto = YlopsApi.UnwrappedOpsOppiaineDto;
export type PerusteLaajaalainenosaaminenDto = YlopsApi.PerusteLaajaalainenosaaminenDto;
export type OppiaineenVuosiluokkakokonaisuusDto = YlopsApi.OppiaineenVuosiluokkakokonaisuusDto;
export type Lops2019OppiaineJarjestysDto = YlopsApi.Lops2019OppiaineJarjestysDto;
export type OppiaineDto = YlopsApi.OppiaineDto;
export type OpetussuunnitelmanJulkaisuDto = YlopsApi.OpetussuunnitelmanJulkaisuDto;
export type PalauteDto = YlopsApi.PalauteDto;
export type LukioOppiaineTiedotDto = YlopsApi.LukioOppiaineTiedotDto;
export type OpetussuunnitelmaExportDto = YlopsApi.OpetussuunnitelmaExportDto;
export type Validointi = YlopsApi.Validointi;
