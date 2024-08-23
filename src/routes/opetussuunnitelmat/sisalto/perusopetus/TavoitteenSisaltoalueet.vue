<template>
  <div class="inner-collapse mb-4" v-if="sisaltoalueet.length > 0 && naytaSisaltoalueet">
    <h4>{{$t('sisaltoalueet')}}</h4>
    <ep-collapse v-for="(sisaltoalue, index) in sisaltoalueet"
                :key="sisaltoalue.id + 'sisaltoalue'+index"
                ref="sisaltoaluecollapse"
                class="sisaltoalue"
                :borderBottom="false"
                :expanded-by-default="false"
                chevronLocation="left"
                :use-padding="false">
      <template v-slot:header>
        <h5 class="nimi" v-html="$kaanna(sisaltoalue.nimi)"></h5>
      </template>

      <div class="pl-4 mb-4 sisaltoaluekuvaus" v-if="sisaltoalue.vuosiluokanSisaltoalue">
        <div v-if="sisaltoalue.kuvaus" v-html="$kaanna(sisaltoalue.kuvaus)"></div>
        <div v-if="(sisaltoalue.vuosiluokanSisaltoalue.kaytaOmaaKuvausta && naytaOmaKuvaus) || sisaltoalue.vuosiluokanSisaltoalue.sisaltoalueet.kuvaus" class="paikallinen-tarkennus-alue">
          <div class="font-weight-600">{{$t('paikallinen-teksti')}}</div>
          <div v-if="sisaltoalue.vuosiluokanSisaltoalue.kaytaOmaaKuvausta && naytaOmaKuvaus"
            v-html="$kaanna(sisaltoalue.vuosiluokanSisaltoalue.omaKuvaus).replace('<p>', '').replace('</p>', '')"></div>
          <div v-else-if="sisaltoalue.vuosiluokanSisaltoalue.sisaltoalueet.kuvaus"
            v-html="$kaanna(sisaltoalue.vuosiluokanSisaltoalue.sisaltoalueet.kuvaus).replace('<p>', '').replace('</p>', '')"></div>
        </div>
      </div>

    </ep-collapse>
  </div>
</template>

<script lang="ts">
import * as _ from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class TavoitteenSisaltoalueet extends Vue {
  @Prop()
  private sisaltoalueet!: any;

  @Prop({ default: true })
  private naytaSisaltoalueet!: boolean;

  @Prop({ default: true })
  private naytaOmaKuvaus!: boolean;
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.paikallinen-tarkennus-alue {
  border-radius: 1rem;
  background-color: $ylops-paikallinen-color;
  padding: 0.8rem;
}

::v-deep .ep-collapse {
  margin-top: 0px;

  .collapse-button {
    margin-bottom: 0px !important;
  }
}

.nimi {
  line-height: 1.7;
}

</style>
