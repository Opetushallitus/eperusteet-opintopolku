<template>
  <b-form-group>
    <div slot="label">
      <div v-if="isEditing" class="mb-2">{{$t('tavoitealueen-otsikko')}}</div>
      <EpInput :isEditing="isEditing" v-model="arvioinninKohdeAlue.otsikko" :class="{'mb-3': isEditing }"/>
    </div>
    <div class="ml-3" v-for="(arvioinninKohde, arvindex) in arvioinninKohdeAlue.arvioinninKohteet" :key="'arvioinninKohde' + arvindex">

      <div class="mb-2">
        <div class="mb-1 font-weight-600" v-if="isEditing || !!$kaanna(arvioinninKohde.otsikko)">{{$t('arvioinnin-kohteen-otsikko')}}</div>
        <EpInput :isEditing="isEditing" v-model="arvioinninKohde.otsikko" />
      </div>
      <div class="mb-3">
        <div class="mb-1 font-weight-600" v-if="isEditing || !!$kaanna(arvioinninKohde.selite)">{{$t('arvioinnin-kohde')}}</div>
        <EpInput :isEditing="isEditing" v-model="arvioinninKohde.selite" />
      </div>

      <template v-if="!arvioinninKohde[arviointiasteikkoRef]">
        <div class="font-weight-600">{{$t('arviointi-asteikon-valinta')}}</div>
        <b-form-radio-group v-model="arvioinninKohde[arviointiasteikkoRef]" stacked @input="arviointiVaihdos(arvioinninKohde)" class="mt-2">
          <b-form-radio
            class="mt-2"
            v-for="arviointiasteikko in arviointiasteikot"
            name="arviointiasteikko"
            :value="arviointiasteikko.id"
            :key="'arviointiasteikko-' + arviointiasteikko.id">

            <span v-for="(osaamistaso, index) in arviointiasteikko.osaamistasot" :key="'osaamistaso' + osaamistaso.id">
              <span v-if="index > 0"> / </span>
              {{$kaanna(osaamistaso.otsikko)}}
            </span>

          </b-form-radio>
        </b-form-radio-group>
      </template>

      <OsaamistasonKriteeri
        class="mb-3 ml-0 p-1 taulukko-rivi-varitys"
        v-for="(osaamistasonkriteeri, osaamistasoIndex) in arvioinninKohde.osaamistasonKriteerit"
        :key="'osaamistasonkriteeri'+osaamistasonkriteeri._osaamistaso"
        v-model="arvioinninKohde.osaamistasonKriteerit[osaamistasoIndex]"
        :isEditing="isEditing"
        :arviointiasteikko="arviointiasteikotKeyById[arvioinninKohde[arviointiasteikkoRef]]"
      />

      <EpButton class="mt-4 no-padding" v-if="isEditing" variant="link" icon="delete" @click="poistaArvioinninKohde(arvioinninKohde)">
        {{$t('poista-arvioinnin-kohde')}}
      </EpButton>

      <hr v-if="isEditing || arvindex < arvioinninKohdeAlue.arvioinninKohteet.length -1"/>
    </div>

    <div class="d-flex justify-content-between">
      <EpButton v-if="isEditing" variant="outline" icon="add" @click="lisaaArvionninkohde">{{$t('lisaa-arvioinnin-kohdealueen-arvioinnin-kohde')}}</EpButton>
      <slot name="poisto" />
    </div>

  </b-form-group>
</template>

<script lang="ts">
import * as _ from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';
import EpInput from '@shared/components/forms/EpInput.vue';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import OsaamistasonKriteeri from '@shared/components/EpArviointi/OsaamistasonKriteeri.vue';

@Component({
  components: {
    EpInput,
    EpButton,
    OsaamistasonKriteeri,
  },
})
export default class EpArviointi extends Vue {
  @Prop({ required: true })
  private value!: any;

  @Prop({ required: true })
  private isEditing!: boolean;

  @Prop({ required: true })
  private arviointiasteikot!: any;

  @Prop({ required: false, default: '_arviointiasteikko' })
  private arviointiasteikkoRef!: any;

  get arvioinninKohdeAlue() {
    return this.value;
  }

  set arvioinninKohdeAlue(val) {
    this.$emit('input', val);
  }

  get arviointiasteikotKeyById() {
    return _.keyBy(_.map(this.arviointiasteikot, arviointiasteikko => {
      return {
        ...arviointiasteikko,
        osaamistasot: _.keyBy(arviointiasteikko.osaamistasot, 'id'),
      };
    }), 'id');
  }

  lisaaArvionninkohde() {
    this.arvioinninKohdeAlue.arvioinninKohteet = [
      ...this.arvioinninKohdeAlue.arvioinninKohteet,
      {},
    ];
  }

  poistaArvioinninKohde(poistettavaKohde) {
    this.arvioinninKohdeAlue.arvioinninKohteet = _.filter(this.arvioinninKohdeAlue.arvioinninKohteet, arvioinninKohde => arvioinninKohde !== poistettavaKohde);
  }

  arviointiVaihdos(muokattavaArvioinninKohde) {
    this.arvioinninKohdeAlue.arvioinninKohteet = _.map(this.arvioinninKohdeAlue.arvioinninKohteet, arvioinninKohde => {
      if (arvioinninKohde === muokattavaArvioinninKohde) {
        const arviointiasteikko = this.arviointiasteikotKeyById[arvioinninKohde[this.arviointiasteikkoRef]];
        return {
          ...arvioinninKohde,
          osaamistasonKriteerit: _.map(arviointiasteikko.osaamistasot, osaamistaso => ({
            _osaamistaso: _.toString(osaamistaso.id),
            kriteerit: [],
          })),
        };
      }

      return arvioinninKohde;
    });
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

</style>
