<template>
  <div class="content">
    <ep-spinner v-if="!tiedot" />

    <div v-else>
      <div v-for="(tieto, index) in tiedotFiltered" :key="index" class="tieto p-2 pl-3" :class="{clickable: hasClickEvent}" @click="avaaTieto(tieto)">
        <div class="otsikko" :class="{'uusi': tieto.uusi}">
          <slot name="otsikko" :item="tieto">
            {{$kaanna(tieto.otsikko)}} <span class="uusi" v-if="tieto.uusi">{{$t('uusi')}}</span>
          </slot>
        </div>
        <div class="muokkausaika">
          <slot name="muokkausaika" :tieto="tieto">
            <span v-if="tieto.muokattu">{{$sd(tieto.muokattu)}}</span>
          </slot>
        </div>
      </div>

      <div v-if="listausTyyppi === 'lisahaku'">
        <ep-button variant="link" @click="naytettavaTietoMaara += 3" v-if="naytettavaTietoMaara < tiedotSize">
          <slot name="lisaaBtnText">
            {{$t('katso-lisaa-tiedotteita')}}
          </slot>
        </ep-button>
        <span v-if="tiedotSize === 0">
          <slot name="eiTietoja">
            {{$t('ei-tuloksia')}}
          </slot>
        </span>
      </div>
      <div v-else>
        <b-pagination align="center"
                      no-local-sorting
                      v-model="sivu"
                      :per-page="naytettavaTietoMaara"
                      :total-rows="tiedotSize"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import _ from 'lodash';
import EpSpinner from '../EpSpinner/EpSpinner.vue';
import EpButton from '../EpButton/EpButton.vue';
import { onkoUusi } from '@shared/utils/tiedote';

export interface JulkiRivi {
  otsikko?: { [key: string]: string; } | string;
  uusi: boolean;
  muokattu?: Date;
}
@Component({
  components: {
    EpSpinner,
    EpButton,
  },
})
export default class EpJulkiLista extends Vue {
  @Prop({ required: true })
  private tiedot!: JulkiRivi[];

  @Prop({ required: false, default: null })
  private tietoMaara!: number;

  @Prop({ required: false, default: 'lisahaku' })
  private listausTyyppi!: 'sivutus' | 'lisahaku';

  private naytettavaTietoMaara = 3;
  private sivu = 1;

  mounted() {
    if (this.tietoMaara) {
      this.naytettavaTietoMaara = this.tietoMaara;
    }
  }

  get hasClickEvent() {
    return this.$listeners && this.$listeners.avaaTieto;
  }

  get tiedotSize() {
    return _.size(this.tiedot);
  }

  get tiedotFiltered() {
    if (this.tiedot) {
      return _.chain(this.tiedot)
        .map((tieto: JulkiRivi) => {
          return {
            ...tieto,
            uusi: onkoUusi((tieto as any).luotu),
          } as JulkiRivi;
        })
        .filter((tieto, index) => this.listausTyyppi === 'lisahaku' || index >= (this.sivu - 1) * this.naytettavaTietoMaara)
        .take(this.naytettavaTietoMaara)
        .value();
    }
  }

  avaaTieto(tieto: JulkiRivi) {
    this.$emit('avaaTieto', tieto);
  }
}
</script>

<style scoped lang="scss">
@import "@shared/styles/_variables.scss";
  .content {
    .tieto:nth-of-type(even) {
      background-color: $table-even-row-bg-color;
    }
    .tieto:nth-of-type(odd) {
      background-color: $table-odd-row-bg-color;
    }
    .tieto {
      &.clickable:hover{
        background-color: $table-hover-row-bg-color;
        cursor: pointer;
      }
      .otsikko {
        &.uusi {
          font-weight: bold;
        }
        .uusi {
          background-color: $blue-lighten-3;
          border-radius: 5px;
          padding: 2px 4px;
          font-size: 0.7rem;
          margin-left: 5px;
        }
      }
      .muokkausaika {
        color: $gray-lighten-12;
        font-size: 90%;
      }
    }
    ::v-deep .btn {
      padding: 0px;
    }
  }
</style>
