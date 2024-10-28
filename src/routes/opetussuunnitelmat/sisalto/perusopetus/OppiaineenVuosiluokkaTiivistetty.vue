<template>
  <div class="tiivistetty-content">
    <h4 class="link-style clickable font-weight-bold" @click="selectOppiaine(oppiaine)">{{$kaanna(oppiaine.nimi)}}</h4>

    <h5 class="mt-3">{{$t('tavoitteet')}}</h5>

    <div v-for="(alue, alueindex) in tavoitteetAlueilla" :key="'alue'+alueindex" class="mt-4">
      <h6 v-if="alue.nimi">{{$kaanna(alue.nimi)}}</h6>

      <div class="striped p-2" v-for="(tavoite, tavoiteindex) in alue.tavoitteet" :key="tavoiteindex + '' + alueindex">
        <div v-html="$kaanna(tavoite.tavoite)"></div>
      </div>
    </div>

    <TavoitteenSisaltoalueet
      :sisaltoalueet="sisaltoalueet"
      :naytaOmaKuvaus="false"
      class="mt-4"
      />

  </div>
</template>

<script lang="ts">
import * as _ from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';
import TavoitteenSisaltoalueet from './TavoitteenSisaltoalueet.vue';

@Component({
  components: {
    TavoitteenSisaltoalueet,
  },
})
export default class OppiaineenVuosiluokkaTiivistetty extends Vue {
  @Prop({ required: true })
  private oppiaineJaTavoitteet!: any;

  get oppiaine() {
    return this.oppiaineJaTavoitteet.oppiaine;
  }

  get tavoitteet() {
    return _.map(this.oppiaineJaTavoitteet.vuosiluokka.tavoitteet, tavoite => {
      return {
        ...tavoite,
        tavoite: this.$kaanna(tavoite.tavoite)
          .replace('<p>', '')
          .replace('</p>', ''),
      };
    });
  }

  get sisaltoalueet() {
    return _.chain(this.tavoitteet)
      .map('sisaltoalueet')
      .flatten()
      .filter('nimi')
      .uniqBy('nimi')
      .value();
  }

  get tavoitealueet() {
    return _.chain(this.tavoitteet)
      .map('kohdealueet')
      .flatten()
      .uniqBy('nimi')
      .value();
  }

  get tavoitteetAlueilla() {
    if (_.size(this.tavoitealueet) > 0) {
      return [
        ..._.map(this.tavoitealueet, tavoitealue => {
          return {
            nimi: tavoitealue.nimi,
            tavoitteet: _.filter(this.tavoitteet, tavoite => _.find(tavoite.kohdealueet, { nimi: tavoitealue.nimi })),
          };
        }),
      ];
    }
    else {
      return [{ nimi: '', tavoitteet: this.tavoitteet }];
    }
  }

  selectOppiaine(oppiaine) {
    this.$emit('selectOppiaine', oppiaine);
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.tiivistetty-content{
  border: 2px solid#E0E0E1;
  border-radius: 1rem;
  padding: 1rem;
}

.striped {
  &:nth-of-type(even) {
    background-color: $table-even-row-bg-color;
  }
  &:nth-of-type(odd) {
    background-color: $table-odd-row-bg-color;
  }
}

.nimi {
  line-height: 1.7;
}

::v-deep .ep-collapse {
  margin-top: 0px;

  .collapse-button {
    margin-bottom: 0px !important;
  }
}

::v-deep .ep-button .btn{
  padding: 0;
}

.paikallinen-tarkennus-alue {
  border-radius: 1rem;
  background-color: $ylops-paikallinen-color;
  padding: 0.8rem;
}

</style>
