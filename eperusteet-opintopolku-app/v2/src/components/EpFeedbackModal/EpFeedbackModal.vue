<template>
  <div>
    <b-modal
      id="feedback-modal"
      centered>
      <template #modal-header>
        <h3 id="feedback-header" aria-level="2" class="text-center mt-2">{{ $t('mita-mielta-uudesta-eperusteet-palvelusta') }}</h3>
      </template>
      <div
        class="d-flex align-items-center justify-content-center my-2"
        role="radiogroup"
        :aria-label="$t('arvio-1-5')">
        <fas
          v-for="rating in currentRatings"
          :key="rating.value"
          icon="tahti-taytetty"
          class="icon-tahti fa-lg mx-3"
          :class="{ 'icon-tahti--active': isActiveRating(rating) }"
          role="radio"
          aria-hidden="false"
          :aria-selected="'' + rating.selected + ''"
          :aria-label="$t('tahti-arvio-' + rating.value)"
          @click="onSelectRating(rating)"
          @mouseover="onRatingHover(rating.value)"
          @mouseout="onRatingBlur()" />
      </div>
      <b-form-group v-if="hasSelectedRating" class="my-4">
        <label for="textarea-feedback">{{ $t('anna-palautetta') }}</label>
        <b-form-textarea
          id="textarea-feedback"
          rows="6"/>
      </b-form-group>
      <template #modal-footer="{ hide }">
        <b-button
          size="md"
          variant="primary"
          pill
          @click="onRatingSubmit()"
          :disabled="!hasSelectedRating">
          {{ $t('laheta') }}
        </b-button>
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

  import _ from 'lodash';

  import EpContent from '@shared/components/EpContent/EpContent.vue';

  interface Rating {
    value: number,
    label: { [key: string]: any },
    selected: boolean,
  }

  @Component({
    components: {
      EpContent,
    }
  })
  export default class EpFeedbackModal extends Vue {
    private hoverValue = 0;
    private selectedValue = 0;
    private ratings = [
      {
        value: 1,
        selected: false,
      }, {
        value: 2,
        selected: false,
      }, {
        value: 3,
        selected: false,
      }, {
        value: 4,
        selected: false,
      }, {
        value: 5,
        selected: false,
      }
    ];
    private message;

    showModal() {
      this.$bvModal.show('feedback-modal');
    }

    onSelectRating(selectedRating: Rating) {
      this.selectedValue = selectedRating.value;
      this.ratings = this.currentRatings.map(rating => ({
          ...rating,
          selected: rating.value === selectedRating.value,
        })
      );
    }

    onRatingHover(val: number) {
      this.hoverValue = val;
    }

    onRatingBlur() {
      this.hoverValue = 0;
    }

    onRatingSubmit() {
      this.$bvModal.hide('feedback-modal')
    }

    isActiveRating(rating: Rating) {
      return rating.value <= this.currentHoveredRating || rating.selected || rating.value < this.selectedValue
    }

    get currentHoveredRating() {
      return this.hoverValue;
    }

    get currentRatings() {
      return this.ratings;
    }

    get hasSelectedRating() {
      return this.currentRatings.some(rating => rating.selected);
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
    color: $gray-lighten-11;
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
