<template>
  <div class="opetussuunnitelma shadow-tile">
    <div class="d-flex align-items-center">
      <div v-if="!voimassaoloTieto" class="opsicon-wrapper">
        <slot name="icon">
          <div class="opsicon"></div>
        </slot>
      </div>
      <div class="nimi flex-fill" :class="voimassaoloClass">
        <div class="ops">
          <span v-html="nimi"></span>
        </div>
        <div class="organisaatiot d-flex">
          <div class="ops-voimassaolo" v-if="voimassaoloTieto && voimassaoloTieto.paiva">
            {{$t(voimassaoloTieto.teksti)}}: {{ $sd(voimassaoloTieto.paiva) }}
            <span class="mr-1"> | </span>
          </div>
          <div class="ops-toimijat" v-if="ops.toimijat && ops.toimijat.length > 0">
            <span class="otsikko">{{ $t('toimijat') }}</span>
            <span class="mr-1">:</span>
            <span class="toimijat" v-for="(toimija, tidx) in toimijat" :key="tidx">
              <span v-html="toimija"></span><span v-if="tidx < ops.toimijat.length - 1">, </span>
            </span>
          </div>
          <div class="ops-oppilaitokset" v-if="ops.oppilaitokset && ops.oppilaitokset.length > 0">
            <span class="otsikko">{{ $t('oppilaitokset') }}</span>
            <span class="mr-1">:</span>
            <span class="toimijat" v-for="(oppilaitos, tidx) in oppilaitokset" :key="tidx">
              <span v-html="oppilaitos" /><span v-if="tidx < ops.oppilaitokset.length - 1">, </span>
            </span>
          </div>

          <div class="ops-koulutustoimija" v-if="ops.koulutustoimija">
            <span class="otsikko">{{ $t('organisaatiot') }}</span>
            <span class="mr-1">:</span>
            <span class="toimijat">{{$kaanna(ops.koulutustoimija.nimi)}}</span>
          </div>
        </div>
      </div>
      <div class="perusteen-nimi">
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { OpetussuunnitelmaJulkinenDto } from '@shared/api/ylops';
import { highlight } from '@/utils/kieli';
import _ from 'lodash';
import { VoimassaoloTieto } from '@/utils/voimassaolo';

@Component
export default class OpetussuunnitelmaTile extends Vue {
  @Prop({ required: true })
  private ops!: OpetussuunnitelmaJulkinenDto;

  @Prop({ default: '' })
  private query!: string;

  @Prop({ required: false })
  private voimassaoloTieto!: VoimassaoloTieto;

  get nimi() {
    return highlight(this.$kaanna((this.ops.nimi as Object)), this.query);
  }

  get toimijat() {
    return _.map((this.ops as any).toimijat, (toimija) => highlight(this.$kaanna(toimija.nimi), this.query));
  }

  get oppilaitokset() {
    return _.map((this.ops as any).oppilaitokset, (oppilaitos) => highlight(this.$kaanna(oppilaitos.nimi), this.query));
  }

  get voimassaoloClass() {
    if (this.voimassaoloTieto) {
      return 'voimassaolo__' + this.voimassaoloTieto.tyyppi;
    }
    return '';
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

@include shadow-tile-hover;

  .opetussuunnitelma {
    border: 1px solid #DADADA;
    border-radius: 2px;
    min-height: 80px;
    margin-bottom: 10px;

  }

  .opsicon-wrapper {
    padding: 20px 25px 20px 25px;

    .opsicon {
      height: 40px;
      width: 40px;
      background: url('../../../public/img/images/opskortti.svg');
      background-size: 40px 40px;
    }
  }

  .nimi {
    padding: 13px 0px;
    color: #3367E3;

    .ops {
      margin-bottom: 8px;
    }
  }

  .perusteen-nimi {
    padding: 20px;
  }

  .organisaatiot {
    color: #2B2B2B;
    font-size: smaller;
  }

  @mixin voimassaolo($tyyppi) {
    margin-left:10px;
    margin-top: 10px;
    margin-bottom: 10px;
    padding: 8px 10px;
    border-left: 3px solid $tyyppi;
  }

  .voimassaolo {
    &__tuleva {
      @include voimassaolo($tyyppi: $tuleva-color)
    }

    &__voimassaoloPaattynyt {
      @include voimassaolo($tyyppi: $paattynyt-color)
    }

    &__voimassa {
      @include voimassaolo($tyyppi: $voimassa-color)
    }

  }

</style>
