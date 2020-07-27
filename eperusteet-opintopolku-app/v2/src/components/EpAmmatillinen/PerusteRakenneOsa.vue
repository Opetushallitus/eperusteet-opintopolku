<template>
  <div :class="{'parentviiva': !viimeinen}">
    <div class="d-flex">
      <div class="parentviiva viimeinen" v-if="!eiVanhempaa && viimeinen"></div>
      <div class="liitosviiva" v-if="!eiVanhempaa"></div>
      <div class="w-100">
        <div class="rakenne" :style="rakenneStyle">
          <div class="d-flex w-100 justify-content-between" :class="{'kuvaukseton': !rakenneosa.kuvaus}" @click="toggleRakenne()">
            <div v-if="rakenneosa.osat && rakenneosa.osat.length > 0">
              <fas icon="chevron-up" v-if="!naytaRakenne"></fas>
              <fas icon="chevron-down" v-else></fas>
            </div>
            <div class="w-75" :class="{'ml-3' : rakenneosa.osat && rakenneosa.osat.length > 0}">
              <slot name="nimi" v-bind:rakenneosa="rakenneosa">
                {{$kaanna(nimi)}}
              </slot>
            </div>
            <div class="w-25 text-right">{{laajuus}}</div>
          </div>

          <div class="text-center" v-if="rakenneosa.kuvaus">
            <fas icon="ellipsis-h" @click="toggleKuvaus()" />
          </div>
          <div class="kuvaus" v-if="naytaKuvaus && rakenneosa.kuvaus" v-html="$kaanna(rakenneosa.kuvaus)" @click="toggleKuvaus()"></div>
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
        :viimeinen="index + 1 === rakenneosa.osat.length">

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

@Component({
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
      if (this.rakenneosa.muodostumisSaanto.laajuus.maksimi !== this.rakenneosa.muodostumisSaanto.laajuus.minimi) {
        return this.rakenneosa.muodostumisSaanto.laajuus.minimi + '-' + this.rakenneosa.muodostumisSaanto.laajuus.maksimi;
      }

      return this.rakenneosa.muodostumisSaanto.laajuus.maksimi;
    }

    if (this.rakenneosa.tutkinnonosa) {
      return this.rakenneosa.tutkinnonosa.laajuus;
    }
  }

  get nimi() {
    if (this.rakenneosa.tutkinnonosa) {
      return this.rakenneosa.tutkinnonosa.nimi;
    }
    return this.rakenneosa.nimi;
  }

  get rakenneStyle() {
    return 'border-color: ' + this.vari;
  }

  get vari() {
    if (this.rakenneosa.tutkinnonosa) {
      return '#fff';
    }

    if (this.rakenneosa.tutkintonimike) {
      return '#666';
    }

    if (!this.eiVanhempaa) {
      if (_.size(this.rakenneosa.osat) > 0
        && _.size(this.rakenneosa.osat) === _.size(_.filter(this.rakenneosa.osat, 'pakollinen'))) {
        return '#5BCA13';
      }
      else {
        return '#f166c0';
      }
    }

    return '#999';
  }
}
</script>

<style scoped lang="scss">
  @import '@shared/styles/_variables.scss';

  .rakenne {
    border-radius: 0.3rem 0 0 0;
    border: 0;
    border-left: 0.3rem;
    border-style: solid;
    border-color: $gray;
    padding:20px 20px 0px 20px;
    margin-top: 20px;
    background-color: $white;
    cursor: pointer;

    .kuvaus {
      padding: 20px;
    }

    .kuvaukseton {
      padding-bottom: 20px;
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
