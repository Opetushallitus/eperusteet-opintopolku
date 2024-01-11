<template>
  <div>
    <div v-for="(arvioinninKohdeAlue, index) in model" :key="'arvioinninKohdeAlue' + index" class="arviointi">
      <EpArviointi
        v-model="model[index]"
        :isEditing="isEditing"
        :arviointiasteikot="arviointiasteikot">

        <div slot="poisto">
          <EpButton v-if="isEditing" variant="link" icon="delete" @click="poistaArvioinninKohdealue(arvioinninKohdeAlue)">{{$t('poista-arvioinnin-kohdealue')}}</EpButton>
        </div>
        </EpArviointi>
    </div>
    <EpButton
      class="mt-3"
      v-if="isEditing"
      variant="outline"
      icon="add"
      @click="lisaaArvioinninKohdeAlue">
        {{$t(lisaaBtnTeksti)}}
      </EpButton>
  </div>
</template>

<script lang="ts">
import * as _ from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';
import EpArviointi from '@shared/components/EpArviointi/EpArviointi.vue';
import EpButton from '@shared/components/EpButton/EpButton.vue';

@Component({
  components: {
    EpArviointi,
    EpButton,
  },
})
export default class EpArvioinninKohdeAlueet extends Vue {
  @Prop({ required: true })
  private value!: any[];

  @Prop({ required: true })
  private isEditing!: boolean;

  @Prop({ required: true })
  private arviointiasteikot!: any;

  get model() {
    return this.value;
  }

  set model(val) {
    this.$emit('input', val);
  }

  lisaaArvioinninKohdeAlue() {
    this.model = [
      ...this.model,
      {
        arvioinninKohteet: [],
      },
    ];
  }

  poistaArvioinninKohdealue(arvioinninKohdeAlue) {
    this.model = _.filter(this.model, arv => arv !== arvioinninKohdeAlue);
  }

  get lisaaBtnTeksti() {
    if (_.size(this.model) > 0) {
      return 'lisaa-arvioinnin-kohdealue';
    }

    return 'lisaa-tutkinnon-osa-kohtainen-arviointi';
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

.arviointi {
    @include tile-background-shadow;
    border-radius: 10px;
    padding: 20px;
    margin-top: 20px;
  }

</style>
