<template>
  <div>
    <b-modal
      id="feedback-modal"
      centered>
      <template #modal-header>
        <h3
          id="feedback-header"
          aria-level="2"
          class="text-center mt-2"
          ref="feedbackHeader"
          tabindex="-1">
          {{ feedbackSent ? $t('kiitos-palautteestasi') : $t('mita-mielta-uudesta-eperusteet-palvelusta') }}
        </h3>
      </template>
      <p v-if="feedbackSent">{{ $t('eperusteet-palautemodal-kiitos-sisalto') }}</p>
      <template v-else>
        <div
          class="d-flex align-items-center justify-content-center my-2"
          role="radiogroup"
          :aria-label="$t('arviointi')">
          <fas
            v-for="rating in currentRatings"
            :key="rating.value"
            icon="tahti-taytetty"
            class="icon-tahti fa-lg mx-3"
            :class="{ 'icon-tahti--active': isActiveRating(rating) }"
            role="radio"
            aria-hidden="false"
            :aria-checked="'' + rating.selected + ''"
            :aria-label="$t('tahti-arvio-' + rating.value)"
            @click="onSelectRating(rating)"
            @mouseover="onRatingHover(rating.value)"
            @mouseout="onRatingBlur()" />
        </div>
        <b-form-group v-if="hasSelectedRating" class="mt-4 mb-0">
          <input type="hidden" v-model="selectedRating">
          <label for="textarea-feedback">{{ $t('anna-palautetta') }}</label>
          <b-form-textarea
            v-model="feedbackMessage"
            id="textarea-feedback"
            rows="4"/>
        </b-form-group>
      </template>
      <template #modal-footer="{ hide }">
        <template v-if="feedbackSent">
          <b-button
            size="md"
            variant="link"
            @click="hide()">
            <span class="mx-3">{{ $t('sulje') }}</span>
          </b-button>
          <a
            class="btn btn-primary btn-md text-white"
            target="_blank"
            :href="futherFeedbackUrl"
            @click="hide()">
            <span class="mx-3">
              {{ $t('kerro-ehdotuksesi') }}
              <span class="sr-only"> ({{ $t('linkki-aukeaa-uuteen-ikkunaan') }})</span>
            </span>
          </a>
        </template>
        <ep-button
          v-else
          @click="onFeedbackSubmit()"
          size="md"
          :disabled="!hasSelectedRating || isSending"
          variant="primary"
          pill
          :show-spinner="isSending">
          <span class="mx-3">{{ $t('laheta') }}</span>
        </ep-button>
        <fas
          class="close-btn"
          aria-hidden="false"
          :aria-label="$t('sulje')"
          focusable="true"
          role="button"
          tabindex="0"
          icon="sulje"
          @click="hide()" />
      </template>
    </b-modal>
    <button
      class="open-btn"
      @click="showModal"
      :aria-label="$t('mita-mielta-uudesta-eperusteet-palvelusta')"
      tabindex="0">
      <fas aria-hidden="true" icon="hymio" class="icon-hymio fa-2x fa-inverse" />
    </button>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  import EpContent from '@shared/components/EpContent/EpContent.vue';
  import EpButton from '@shared/components/EpButton/EpButton.vue';

  import { Palautteet } from '@shared/api/eperusteet';

  import { Kielet } from '@shared/stores/kieli';

  interface Rating {
    value: number,
    selected: boolean,
  }

  @Component({
    components: {
      EpContent,
      EpButton,
    }
  })
  export default class EpFeedbackModal extends Vue {
    private hoveredRating = 0;
    private selectedRating = 0;
    private ratings = Array.from({length: 5}, (v, k) => ({ value: k + 1, selected: false }));
    private feedbackMessage = '';
    private feedbackSent = false;
    private isSending = false;

    mounted() {
      this.$root.$on('bv::modal::hidden', (bvEvent, modalId) => {
        this.feedbackSent = false;
        this.feedbackMessage = '';
        this.selectedRating = 0;
        this.ratings = this.ratings.map(rating => ({ ...rating, selected: false }));
      })
    }

    showModal() {
      this.$bvModal.show('feedback-modal');
    }

    onSelectRating(selectedRating: Rating) {
      this.selectedRating = selectedRating.value;
      this.ratings = this.currentRatings.map(rating => ({
          ...rating,
          selected: rating.value === selectedRating.value,
        })
      );
    }

    onRatingHover(val: number) {
      this.hoveredRating = val;
    }

    onRatingBlur() {
      this.hoveredRating = 0;
    }

    async onFeedbackSubmit() {
      this.isSending = true;
      await Palautteet.sendPalaute({
        stars: this.selectedRating,
        feedback: this.feedbackMessage,
      });
      this.isSending = false;
      this.feedbackSent = true;
      (this.$refs.feedbackHeader as HTMLElement).focus();
    }

    isActiveRating(rating: Rating) {
      return rating.value <= this.hoveredRating || rating.selected || rating.value < this.selectedRating
    }

    get currentRatings() {
      return this.ratings;
    }

    get hasSelectedRating() {
      return this.currentRatings.some(rating => rating.selected);
    }

    get sisaltokieli() {
      return Kielet.getSisaltoKieli.value;
    }

    get futherFeedbackUrl() {
      return `https://www.oph.fi/${this.sisaltokieli}/koulutus-ja-tutkinnot/tutkintorakenne/lomake`
    }
  }
</script>

<style scoped lang="scss">
  @import '@shared/styles/_variables.scss';

  .open-btn {
    appearance: none;
    border: none;
    margin: 0;
    padding: 0.5rem;
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    background-color: $green;
    border-radius: 50%;
    box-shadow: 0px 8px 17px 8px rgba(0,0,0,0.25);
    transition: background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1);

    &:focus,
    &:hover {
      background-color: darken($green, 10%);
    }
  }
  .icon-hymio {
    font-size: 2.75rem;
  }
  .icon-tahti {
    color: $gray-lighten-12;
    cursor: pointer;

    &:focus,
    &:hover,
    &--active {
      color: $yellow;
    }

    outline-color: transparent;
  }
  .close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
</style>
