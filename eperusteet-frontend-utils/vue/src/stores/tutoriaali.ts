import { Getter, State, Store } from '../stores/store';
import _ from 'lodash';

@Store
export class TutoriaaliStore {
  @State()
  public avaimet: string[]= [];

  @State()
  private index = 0;

  @State()
  public active = false;

  seuraava() {
    this.index = this.index + 1;
  }

  edellinen() {
    this.index = this.index - 1;
  }

  @Getter(state => state.avaimet[state.index + 1])
  public readonly seuraavaAvain: string | undefined;

  @Getter(state => state.avaimet[state.index])
  public readonly current: string | undefined;

  @Getter(state => state.index + 1 < _.size(state.avaimet))
  public readonly hasSeuraava!: boolean;

  @Getter(state => state.index > 0)
  public readonly hasEdellinen!: boolean;

  public readonly paivitaAvaimet = _.debounce(() => {
    const uudetAvaimet: string[] = [];
    document.querySelectorAll('[tutorial]').forEach(el => {
      const elId = el.getAttribute('id');
      if (elId) {
        uudetAvaimet.push(elId);
      }
    });

    this.avaimet = uudetAvaimet;
  }, 100);

  setActive(active: boolean) {
    this.index = 0;
    this.active = active;
  }

  @Getter(state => state.active)
  public readonly isActive!: boolean;
}

export const tutoriaaliStore = new TutoriaaliStore();
