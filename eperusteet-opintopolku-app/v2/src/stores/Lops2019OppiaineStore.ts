import _ from 'lodash';
import { Store, State } from '@shared/stores/store';
import { Lops2019 } from '@shared/api/eperusteet';
import { Lops2019OppiaineKaikkiDto } from '@shared/api/tyypit';

@Store
export class Lops2019OppiaineStore {
  @State() public perusteId: number | null = null;
  @State() public oppiaineId: number | null = null;
  @State() public oppiaine: Lops2019OppiaineKaikkiDto | null = null;

  /**
   * Haetaan oppiaine asetetuilla parametreillä jos ei ole jo haettu
   */
  async getOppiaine(perusteId: number, oppiaineId: number) {
    if (!perusteId || !oppiaineId) {
      this.perusteId = null;
      this.oppiaineId = null;
      this.oppiaine = null;
    }
    else if (perusteId !== this.perusteId || oppiaineId !== this.oppiaineId || !this.oppiaine) {
      this.perusteId = perusteId;
      this.oppiaineId = oppiaineId;
      this.oppiaine = null;
      this.oppiaine = (await Lops2019.getOppiaine(this.perusteId, this.oppiaineId)).data;
    }
  }
}
