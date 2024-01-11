import { Getter, State, Store } from '@shared/stores/store';
import _ from 'lodash';
import { Location } from 'vue-router';

@Store
class MurupolkuStore {
  @State()
  public polku: { [avain: string]: any } = {};

  @Getter(state => {
    return {
      ...state.polku,
    };
  })
  public readonly murut!: object;

  aseta(key: string, value: any, location?: Location) {
    this.polku = {
      ...this.polku,
      [key]: {
        name: value,
        location,
      },
    };
  }

  tyhjenna() {
    this.polku = [];
  }
}

export const Murupolku = new MurupolkuStore();
