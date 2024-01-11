<template>
  <div v-if="show">
    <div class="tutorial-bg"></div>
    <b-popover show v-if="current" :target="current" :key="current" placement="bottom" custom-class="tutorial-popover">
      <div class="tutorial-popover-content">{{ $t('tutorial-' + current)}}</div>
      <div class="tutorial-popover-buttons">
        <ep-button class="mr-5"
          @click="suljeTutoriaali"
          variant="link"
          size="sm">
          {{ $t('poistu')}}
        </ep-button>

        <div class="float-right">
          <ep-button v-if="hasEdellinen"
            class="ml-2"
            @click="edellinen"
            size="sm">
            {{ $t('edellinen')}}
          </ep-button>

          <ep-button v-if="hasSeuraava"
            class="float-right ml-2"
            @click="seuraava"
            size="sm">
            {{ $t('seuraava')}}
          </ep-button>
        </div>
      </div>
    </b-popover>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import { TutoriaaliStore } from '@shared/stores/tutoriaali';
import _ from 'lodash';

@Component({
  components: {
    EpButton,
  },
})
export default class EpTutorial extends Vue {
  @Prop()
  private tutoriaalistore!: TutoriaaliStore;

  suljeTutoriaali() {
    this.tutoriaalistore.setActive(false);
  }

  get show() {
    return this.tutoriaalistore.isActive;
  }

  get current() {
    return this.tutoriaalistore.current;
  }

  get hasSeuraava() {
    return this.tutoriaalistore.hasSeuraava;
  }

  get hasEdellinen() {
    return this.tutoriaalistore.hasEdellinen;
  }

  seuraava() {
    this.tutoriaalistore.seuraava();
  }

  edellinen() {
    this.tutoriaalistore.edellinen();
  }

  @Watch('show')
  nakyvyysMuutos(val, oldVal) {
    if (val) {
      this.tutoriaalistore.paivitaAvaimet();
      this.muutaTyyli(this.current, undefined);
    }
    else {
      this.muutaTyyli(undefined, this.current);
    }
  }

  @Watch('current')
  muutaTyyli(val, oldVal) {
    if (oldVal) {
      const oldEl = document.getElementById(oldVal);
      if (oldEl) {
        oldEl.classList.remove('tutorial-highlight');
      }
    }

    if (val && this.show) {
      const el = document.getElementById(val);
      if (el) {
        el.classList.add('tutorial-highlight');
      }
    }
  }
}
</script>
