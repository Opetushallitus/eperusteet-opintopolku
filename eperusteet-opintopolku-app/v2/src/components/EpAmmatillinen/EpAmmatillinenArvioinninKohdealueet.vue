<template>
  <ep-form-content class="col-md-12" name="arviointi">
    <div v-for="(arvioinninKohdealue, index) in arvioinninKohdealueetFilled" :key="'aka'+index" class="mb-5">
      <div class="kohdealueotsikko mt-3">{{$kaanna(arvioinninKohdealue.otsikko)}}</div>

      <div v-for="(arvioinninkohde, index) in arvioinninKohdealue.arvioinninKohteet" :key="'arvioinninkohde'+index" class="mb-5">

        <div class="mb-2 mt-4">
          <div class="font-weight-bold mb-3">{{$kaanna(arvioinninkohde.otsikko)}}</div>
          <div>{{$kaanna(arvioinninkohde.selite)}}</div>
        </div>

        <b-table striped :items="arvioinninkohde.osaamistasonKriteerit" :fields="osaamistasonKriteeritFields" responsive thead-class="d-none">
          <template v-slot:cell(osaamistaso)="{item}">
            <span v-if="item.osaamistaso"> {{$kaanna(item.osaamistaso.otsikko)}}</span>
          </template>

          <template v-slot:cell(kriteerit)="{item}">
            <ul>
              <li v-for="(kriteeri, index) in item.kriteerit" :key="'kriteeri'+index">
                {{$kaanna(kriteeri)}}
              </li>
            </ul>
          </template>
        </b-table>

      </div>
    </div>

    <slot />
  </ep-form-content>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import * as _ from 'lodash';

@Component({
  components: {
    EpFormContent,
  },
})
export default class EpAmmatillinenArvioinninKohdealueet extends Vue {
  @Prop({ required: true })
  private arvioinninKohdealueet!: any;

  @Prop({ required: true })
  private arviointiasteikot!: any[];

  get arvioinninKohdealueetFilled() {
    return _.map(this.arvioinninKohdealueet, arvKohdealue => {
      return {
        ...arvKohdealue,
        arvioinninKohteet: _.map(arvKohdealue.arvioinninKohteet, arvioinninKohde => {
          const arviointiasteikkoId = arvioinninKohde._arviointiAsteikko || arvioinninKohde._arviointiasteikko;
          const arviointiAsteikko = _.keyBy(this.arviointiasteikot, 'id')[arviointiasteikkoId];
          const osaamistasot = _.keyBy(arviointiAsteikko.osaamistasot, 'id');
          return {
            ...arvioinninKohde,
            osaamistasonKriteerit: _.sortBy(_.map(arvioinninKohde.osaamistasonKriteerit, osaamistasonKriteeri => {
              return {
                ...osaamistasonKriteeri,
                osaamistaso: osaamistasot[osaamistasonKriteeri._osaamistaso],
              };
            }), '_osaamistaso'),
          };
        }),
      };
    });
  }

  get osaamistasonKriteeritFields() {
    return [{
      key: 'osaamistaso',
      thStyle: { width: '40%' },
    }, {
      key: 'kriteerit',
    }] as any[];
  }
}
</script>

<style scoped lang="scss">

  .kohdealueotsikko {
    font-weight: 600;
  }

</style>
