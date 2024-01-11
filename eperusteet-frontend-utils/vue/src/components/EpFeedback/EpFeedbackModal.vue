<template>
  <div>
    <b-modal
      id="feedback-modal"
      centered>
      <template #modal-header>
        <h3
          id="feedback-header"
          aria-level="2"
          class="mt-2 pr-4"
          ref="feedbackHeader"
          tabindex="-1">
          {{ feedbackSent ? $t('kiitos-palautteestasi') : $t('mita-mielta-uudesta-eperusteet-palvelusta') }}
        </h3>
      </template>
      <p v-if="feedbackSent">
        <span v-if="tutkintorakennepalaute">{{ $t('eperusteet-palautemodal-kiitos-sisalto') }}</span>
      </p>
      <template v-else>
        <div
          class="d-flex align-items-center justify-content-center my-2"
          role="radiogroup"
          :aria-label="$t('arviointi')">
          <div v-for="rating in currentRatings"
               :key="rating.value"
               class="icon-tahti fa-lg mx-3"
               @click="onSelectRating(rating)"
               @mouseenter="onRatingHover(rating.value)"
               @mouseleave="onRatingBlur" >
            <EpMaterialIcon :class="{ 'icon-tahti--active': isActiveRating(rating) }"
                            aria-hidden="false"
                            :aria-label="$t('tahti-arvio-' + rating.value)">star</EpMaterialIcon>
          </div>
        </div>
        <b-form-group v-if="hasSelectedRating" class="mt-4 mb-0">
          <input type="hidden" v-model="selectedRating">
          <label for="textarea-feedback">{{ $t('anna-palautetta-eperusteista') }}</label>
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
            :variant="tutkintorakennepalaute ? 'link' : 'primary'"
            @click="hide()">
            <span class="mx-3">{{ $t('sulje') }}</span>
          </b-button>
          <a
            v-if="tutkintorakennepalaute"
            class="btn btn-primary btn-md text-white"
            target="_blank"
            :href="furtherFeedbackUrl"
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
        <div class="close-btn" @click="hide()">
          <EpMaterialIcon aria-hidden="false" :aria-label="$t('sulje')">close</EpMaterialIcon>
        </div>
      </template>
    </b-modal>
    <button
      id="open-btn"
      class="open-btn"
      @click="showModal"
      :aria-label="$t('mita-mielta-uudesta-eperusteet-palvelusta')"
      tabindex="0">
      <EpMaterialIcon class="icon-hymio"
                      :color="'white'"
                      size="2.75rem"
                      v-b-popover="{content: $t('anna-palautetta-eperusteista'), trigger: 'hover', placement: 'top', variant: 'primary'}">sentiment_satisfied_alt</EpMaterialIcon>
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import EpContent from '@shared/components/EpContent/EpContent.vue';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import { Kielet } from '@shared/stores/kieli';
import { ITPalauteProvider } from '@shared/stores/types';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

interface Rating {
  value: number,
  selected: boolean,
}

@Component({
  components: {
    EpContent,
    EpButton,
    EpMaterialIcon,
  },
})
export default class EpFeedbackModal extends Vue {
  private hoveredRating = 0;
  private selectedRating = 0;
  private ratings = Array.from({ length: 5 }, (v, k) => ({ value: k + 1, selected: false }));
  private feedbackMessage = '';
  private feedbackSent = false;
  private isSending = false;

  @Prop({ required: true })
  private palauteProvider!: ITPalauteProvider;

  mounted() {
    this.$root.$on('bv::modal::hidden', () => {
      this.feedbackSent = false;
      this.feedbackMessage = '';
      this.selectedRating = 0;
      this.ratings = this.ratings.map(rating => ({ ...rating, selected: false }));
    });
  }

  get tutkintorakennepalaute() {
    return this.palauteProvider.tutkintorakennepalaute.value;
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
    await this.palauteProvider.sendPalaute({
      stars: this.selectedRating,
      feedback: this.feedbackMessage,
      user_agent: navigator.userAgent,
    });
    this.isSending = false;
    this.feedbackSent = true;
    (this.$refs.feedbackHeader as HTMLElement).focus();
  }

  isActiveRating(rating: Rating) {
    return rating.value <= this.hoveredRating || rating.selected || rating.value < this.selectedRating;
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

  get furtherFeedbackUrl() {
    return `https://www.oph.fi/${this.sisaltokieli}/koulutus-ja-tutkinnot/tutkintorakenne/lomake`;
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
    box-shadow: 0 8px 17px 8px rgba(0,0,0,0.25);
    transition: background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1);

    &:focus,
    &:hover {
      background-color: darken($green, 10%);
    }
  }

  .icon-tahti {
    color: $gray-lighten-12;
    cursor: pointer;
    font-size: 1.2rem;

    &:focus,
    &:hover,
    &--active {
      color: $blue-lighten-5;
    }

    outline-color: transparent;
  }
  .close-btn {
    cursor: pointer;
    position: absolute;
    top: 1rem;
    right: 1rem;

    &--tooltip {
      font-size: 1.1rem;
      right: 0.5rem;
    }
  }
  ::v-deep .tooltip-inner {
    color: $gray;
    background-color: $white;
    border-radius: 0;
    border: 1px solid $gray-lighten-2;
    padding: 1rem 0.5rem;
    font-size: 0.7rem;
    max-width: 130px;
    text-align: left;
  }
  ::v-deep .arrow::before {
    display: none;
  }
</style>
