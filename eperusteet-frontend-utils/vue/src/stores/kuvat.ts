import { TermiDto, LiiteDto } from '../api/ylops';
import _ from 'lodash';

export interface LiiteWithSrc extends LiiteDto {
  src: string,
};

export interface IAttachmentWrapper {
  endpoint: () => string,
  hae: () => Promise<LiiteWithSrc[]>,
  url: (id: string) => string,
}

export interface IKasiteHandler {
  /**
   * Hae yksi termi termin avainarvolla (UUID)
   */
  getOne: (avain: string) => Promise<TermiDto>,

  /**
   * Hae kaikki termit
   */
  getAll: () => Promise<TermiDto[]>,

  /**
   * Lisää uusi termi tai päivitä termiä. Vanhaa päivitetään jos `avain` ja `id` löytyy.
   */
  addOrUpdate: (termi: TermiDto) => Promise<TermiDto>,
};
