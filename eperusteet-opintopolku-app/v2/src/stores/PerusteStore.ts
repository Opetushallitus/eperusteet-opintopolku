import { Store, Getter, State } from '@shared/stores/store';
import { PerusteDto, TiedoteDto } from '@shared/api/tyypit';
import { Perusteet, Tiedotteet } from '@shared/api/eperusteet';
import _ from 'lodash';


@Store
export class PerusteStore {
  @State() public perusteet: PerusteDto[] | null = null;
  @State() public uusimmat: PerusteDto[] | null = null;

  async getYleisetPerusteet() {
    this.perusteet = ((await Perusteet.getAllPerusteet(
      0,
      100,
      true,
      true,
      true,
      false,
      undefined,
      undefined,
      [
        'koulutustyyppi_2',
        'koulutustyyppi_5',
        'koulutustyyppi_6',
        'koulutustyyppi_14',
        'koulutustyyppi_15',
        'koulutustyyppi_16',
        'koulutustyyppi_17',
        'koulutustyyppi_18',
        'koulutustyyppi_20',
        'koulutustyyppi_22',
        'koulutustyyppi_23',
        'koulutustyyppi_999907',
      ])).data as any).data;
  }

  async getUusimmat() {
    this.uusimmat = _.chain((await Perusteet.getUusimmatPerusteet('fi')).data)
      .sortBy('paatospvm')
      .reverse()
      .take(5)
      .value();
  }
}
