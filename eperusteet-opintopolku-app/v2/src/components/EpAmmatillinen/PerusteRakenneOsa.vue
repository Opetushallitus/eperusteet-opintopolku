<template>
  <div :class="{'parentviiva': !viimeinen}">
    <div class="d-flex">
      <div class="parentviiva viimeinen" v-if="!eiVanhempaa && viimeinen"></div>
      <div class="liitosviiva" v-if="!eiVanhempaa"></div>
      <div class="w-100">
        <div class="rakenne" :style="rakenneStyle">
          <div class="d-flex w-100 justify-content-between" :class="{'kuvaukseton': !rakenneosa.kuvaus}" @click="toggleRakenne()">
            <div v-if="rakenneosa.osat && rakenneosa.osat.length > 0">
              <EpMaterialIcon v-if="!naytaRakenne">expand_more</EpMaterialIcon>
              <EpMaterialIcon v-else>expand_less</EpMaterialIcon>
            </div>
            <div class="w-75" :class="{'ml-3' : rakenneosa.osat && rakenneosa.osat.length > 0}">
              <slot name="nimi" v-bind:rakenneosa="rakenneosa">
                {{$kaanna(nimi)}}
              </slot>
            </div>
            <div class="w-25 text-right">{{laajuus}}</div>
          </div>

          <div class="text-center" v-if="rakenneosa.kuvaus || rakenneosa.paikallinenKuvaus && rakenneosa.paikallinenKuvaus.kuvaus" @click="toggleKuvaus()">
            <EpMaterialIcon>more_horiz</EpMaterialIcon>
          </div>
          <div v-if="naytaKuvaus" class="kuvaus">
            <div v-html="$kaanna(rakenneosa.kuvaus)"></div>
            <div v-if="rakenneosa.paikallinenKuvaus && rakenneosa.paikallinenKuvaus.kuvaus" class="mt-3">
              <span class="paikallinen-kuvaus">{{ $t('koulutuksen-jarjestajan-tarkennus') }}</span>
              <div v-html="$kaanna(rakenneosa.paikallinenKuvaus.kuvaus)"></div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <div class="rakenneosat" :class="{'viimeinen': viimeinen}" v-if="naytaRakenne">
      <peruste-rakenne-osa
        v-for="(osa, index) in rakenneosa.osat"
        :key="'osa'+index"
        ref="rakenneosa"
        :rakenneosa="osa"
        :class="{'rakennemargin': !eiVanhempaa}"
        :viimeinen="index + 1 === rakenneosa.osat.length"
        :parentMandatory="pakollinen(rakenneosa)">

        <template v-slot:nimi="{ rakenneosa }">
          <slot name="nimi" v-bind:rakenneosa="rakenneosa"></slot>
        </template>
      </peruste-rakenne-osa>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import _ from 'lodash';
import { rakenneNodecolor } from '@shared/utils/perusterakenne';
import EpMaterialIcon from '@shared/components//EpMaterialIcon/EpMaterialIcon.vue';

@Component({
  components: {
    EpMaterialIcon,
  },
  name: 'PerusteRakenneOsa',
})
export default class PerusteRakenneOsa extends Vue {
  @Prop({ required: true })
  private rakenneosa: any;

  private naytaRakenne: boolean = false;
  private naytaKuvaus: boolean = false;

  @Prop({ required: false, default: false })
  private eiVanhempaa!: boolean;

  @Prop({ required: false, default: false })
  private viimeinen!: boolean;

  @Prop({ default: false, type: Boolean })
  private parentMandatory!: boolean;

  pakollinen(node) {
    return (node.rooli === 'määritelty' && this.$kaanna(node.nimi) === this.$t('rakenne-moduuli-pakollinen')) || node.pakollinen;
  }

  toggleKuvaus(naytaKuvaus) {
    if (naytaKuvaus) {
      this.naytaKuvaus = naytaKuvaus;
      this.$nextTick(() => {
        _.forEach(this.$refs.rakenneosa, (rakenneosa: any) => rakenneosa.toggleKuvaus(this.naytaKuvaus));
      });
    }
    else {
      this.naytaKuvaus = !this.naytaKuvaus;
    }
  }

  toggleRakenne(naytaRakenne) {
    if (naytaRakenne) {
      this.naytaRakenne = naytaRakenne;
      this.$nextTick(() => {
        _.forEach(this.$refs.rakenneosa, (rakenneosa: any) => rakenneosa.toggleRakenne(this.naytaRakenne));
      });
    }
    else {
      this.naytaRakenne = !this.naytaRakenne;
    }
  }

  get laajuus() {
    if (this.rakenneosa.muodostumisSaanto) {
      const tyyppi = this.rakenneosa.muodostumisSaanto.laajuus || this.rakenneosa.muodostumisSaanto.koko;

      if (!_.isNil(tyyppi.minimi) && !_.isNil(tyyppi.maksimi) && tyyppi.minimi !== tyyppi.maksimi) {
        return tyyppi.minimi + ' - ' + tyyppi.maksimi;
      }

      return tyyppi.minimi || tyyppi.maksimi || '';
    }

    if (this.rakenneosa.tutkinnonosa?.perusteenTutkinnonosaViite?.laajuus) {
      return this.rakenneosa.tutkinnonosa.perusteenTutkinnonosaViite.laajuus;
    }

    if (this.rakenneosa.tutkinnonosa?.laajuus) {
      return this.rakenneosa.tutkinnonosa.laajuus;
    }

    if (this.rakenneosa.tutkinnonosa?.tosa?.omatutkinnonosa?.laajuus) {
      return this.rakenneosa.tutkinnonosa.tosa?.omatutkinnonosa?.laajuus;
    }
  }

  get nimi() {
    if (this.rakenneosa.tutkinnonosa) {
      return this.rakenneosa.tutkinnonosa.tutkinnonOsa?.nimi || this.rakenneosa.tutkinnonosa.nimi;
    }
    return this.rakenneosa.nimi;
  }

  get rakenneStyle() {
    return 'border-color: ' + rakenneNodecolor(this.rakenneosa, this.parentMandatory, this);
  }
}
</script>

<style scoped lang="scss">
  @import '@shared/styles/_variables.scss';

  .rakenne {
    border-radius: 0;
    border: 0 solid $gray;
    border-left-width: 0.3rem;
    padding:20px 20px 0px 20px;
    margin-top: 20px;
    background-color: $white;
    cursor: pointer;

    .kuvaus {
      padding: 10px 20px;
    }

    .kuvaukseton {
      padding-bottom: 20px;
    }

    .paikallinen-kuvaus {
      font-weight: 500;
    }
  }

  .liitosviiva {
    width: 20px;
    border-top: 2px solid $gray-lighten-3;
    transform: translateY(3rem);
  }

  .parentviiva {
    border-left: 2px solid $gray-lighten-3;
  }

  .parentviiva.viimeinen {
    height: 50px;
  }

  .rakenneosat.viimeinen{
    margin-left: 2px;
  }

  .rakennemargin {
    margin-left: 20px;
  }

</style>
