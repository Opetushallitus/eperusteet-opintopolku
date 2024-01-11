<template>
  <div>
    <div v-for="(opintojakso, index) in opintojaksot" :key="index">
      <div class="oj-content" @click="select(opintojakso)" :class="{'selected': opintojakso.selected || !isEditing, 'selectable': isEditing}">
        <span class="nimi">
          <span class="mr-2">{{ $kaanna(opintojakso.nimi) }}</span>
          <span v-if="opintojakso.koodi">({{ opintojakso.koodi }})</span>
        </span>
        <span class="pituus">{{ opintojakso.laajuus }} {{ $t('opintopiste') }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Lops2019OpintojaksoDto } from '@shared/api/ylops';

@Component
export default class EpOpintojaksoSelect extends Vue {
  @Prop({ required: false })
  private options!: Lops2019OpintojaksoDto[];

  @Prop({ required: true })
  private value!: Lops2019OpintojaksoDto[];

  @Prop({ required: false, default: false })
  private isEditing!: boolean;

  get opintojaksot() {
    if (!this.isEditing) {
      return this.value;
    }

    return _.map(this.options, (option) => {
      return {
        ...option,
        selected: _.includes(_.map(this.value, 'koodi'), option.koodi),
      };
    });
  }

  select(opintojakso) {
    if (!this.isEditing) {
      return;
    }

    if (_.includes(_.map(this.value, 'koodi'), opintojakso.koodi)) {
      this.$emit('input', _.filter(this.value, (oj) => oj.koodi !== opintojakso.koodi));
    }
    else {
      this.$emit('input', [
        ...this.value,
        opintojakso,
      ]);
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@shared/styles/_variables.scss";

  .oj-content {
    border-radius: 24px;
    border: 1px solid #CDEEFF;
    padding: 14px 30px;
    display: flex;
    margin-top: 5px;
    margin-bottom: 5px;
    background-color: #E6F6FF;

    &.selectable{
      cursor:pointer;
    }

    span.nimi {
      flex: 1 0 auto;
    }

    span.pituus {
      min-width: 4em;
    }

    span.tyyppi {
      min-width: 6em;
    }

    &.selected {
      background-color: #3367E3;
      color: $white;
    }

    &:hover:not(.selected.selectable) {
      background-color: #C3EAFF;
    }
  }

</style>
