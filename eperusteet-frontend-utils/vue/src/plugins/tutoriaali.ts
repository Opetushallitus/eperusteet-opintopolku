import { TutoriaaliStore } from '../stores/tutoriaali';
import Vue from 'vue';

interface VueTutorialParams {
  tutoriaaliStore: TutoriaaliStore;
}

export class VueTutorial {
  public static install(vue: typeof Vue, options: VueTutorialParams) {
    if (!options?.tutoriaaliStore) {
      throw new Error('TutoriaaliStore puuttuu');
    }

    vue.directive('tutorial', {
      inserted(el, def) {
        el.setAttribute('tutorial', '');
        options.tutoriaaliStore.paivitaAvaimet();
      },
    });
  }
};
