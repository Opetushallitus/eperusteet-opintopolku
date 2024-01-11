<template>
  <div class="content">
    <ep-spinner v-if="!tiedotteet" />

    <div v-else>
      <div v-for="(tiedote, index) in tiedotteetFiltered" :key="index" class="tiedote p-2 pl-3" @click="avaaTiedote(tiedote)">
        <div class="otsikko" :class="{'uusi': tiedote.uusi}">{{$kaanna(tiedote.otsikko)}} <span class="uusi" v-if="tiedote.uusi">{{$t('uusi')}}</span></div>
        <div class="muokkausaika">{{$sdt(tiedote.muokattu)}}</div>
      </div>

      <div>
        <ep-button variant="link" @click="naytettavaTiedoteMaara += 3" v-if="naytettavaTiedoteMaara < tiedotteetSize">
          <slot name="lisaaBtnText">
            {{$t('katso-lisaa-tiedotteita')}}
          </slot>
        </ep-button>
        <span v-if="tiedotteetSize === 0">{{$t('ei-tiedotteita')}}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Mixins, Watch } from 'vue-property-decorator';
import _ from 'lodash';
import EpSpinner from '../EpSpinner/EpSpinner.vue';
import EpButton from '../EpButton/EpButton.vue';
import { TiedoteDto } from '../../api/eperusteet';
import { ITiedotteetProvider } from '../../stores/types';
import { onkoUusi } from '@shared/utils/tiedote';

interface ListaTiedote extends TiedoteDto {
  uusi: boolean;
}

@Component({
  components: {
    EpSpinner,
    EpButton,
  },
})
export default class EpTiedoteList extends Vue {
  @Prop({ required: true })
  private tiedotteet!: TiedoteDto[];

  @Prop({ required: false })
  private tiedoteMaara;

  private naytettavaTiedoteMaara = 3;

  mounted() {
    if (this.tiedoteMaara) {
      this.naytettavaTiedoteMaara = this.tiedoteMaara;
    }
  }

  get tiedotteetSize() {
    return _.size(this.tiedotteet);
  }

  get tiedotteetFiltered() {
    if (this.tiedotteet) {
      return _.chain(this.tiedotteet)
        .map((tiedote: TiedoteDto) => {
          return {
            ...tiedote,
            uusi: onkoUusi((tiedote as any).luotu),
          } as ListaTiedote;
        })
        .take(this.naytettavaTiedoteMaara)
        .value();
    }
  }

  avaaTiedote(tiedote: TiedoteDto) {
    this.$emit('avaaTiedote', tiedote);
  }
}
</script>

<style scoped lang="scss">
@import "@shared/styles/_variables.scss";
  .content {
    .tiedote:nth-of-type(even) {
      background-color: $table-even-row-bg-color;
    }
    .tiedote:nth-of-type(odd) {
      background-color: $table-odd-row-bg-color;
    }
    .tiedote {
      &:hover{
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
        color: $gray-lighten-1;
      }
    }
    ::v-deep .btn {
      padding: 0px;
    }
  }
</style>
