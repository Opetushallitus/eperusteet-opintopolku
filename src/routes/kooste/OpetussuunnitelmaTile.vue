<template>
  <div class="opetussuunnitelma shadow-tile" @mouseover="$emit('mouseover', $event)">
    <div class="d-flex align-items-center">
      <div v-if="showOpsIcon" class="opsicon-wrapper">
        <slot name="icon">
          <div class="opsicon"></div>
        </slot>
      </div>
      <div class="nimi flex-fill">
        <div class="ops d-flex align-items-center">
          <div v-html="nimi"></div>
          <div v-if="ops.jotpatyyppi && showJotpaInfo" class="nimi__jotpa ml-2">
            {{$t('jotpa')}}
          </div>
        </div>
        <div class="organisaatiot">
          <div class="meta d-flex" v-if="voimassaoloTiedot && voimassaoloTiedot.length > 0">
            <div v-for="(voimassaolotieto, index) in voimassaoloTiedot" :key="'voimassa' + index">
              <div v-if="voimassaolotieto.paiva">
                <span v-if="index > 0"> | </span>
                <span class="otsikko">{{$t(voimassaolotieto.teksti)}}: </span>
                <span>{{ $sd(voimassaolotieto.paiva) }}</span>
              </div>
            </div>
            <EpVoimassaolo :voimassaolo="ops"></EpVoimassaolo>
          </div>
          <div class="meta mr-2" v-if="ops.toimijat && ops.toimijat.length > 0">
            <span class="otsikko">{{ $t('toimijat') }}</span>
            <span class="mr-1">:</span>
            <span class="toimijat" v-for="(toimija, tidx) in toimijat" :key="tidx">
              <span v-html="toimija"></span><span v-if="tidx < ops.toimijat.length - 1">, </span>
            </span>
          </div>
          <div class="meta mr-2" v-if="ops.oppilaitokset && ops.oppilaitokset.length > 0">
            <span class="otsikko">{{ $t('oppilaitokset') }}</span>
            <span class="mr-1">:</span>
            <span class="toimijat" v-for="(oppilaitos, tidx) in oppilaitokset" :key="tidx">
              <span v-html="oppilaitos" /><span v-if="tidx < ops.oppilaitokset.length - 1">, </span>
            </span>
          </div>
          <div class="meta" v-if="ops.koulutustoimija">
            <span class="otsikko">{{ $t('organisaatiot') }}</span>
            <span class="mr-1">:</span>
            <span class="toimijat">{{$kaanna(ops.koulutustoimija.nimi)}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { highlight } from '@/utils/kieli';
import _ from 'lodash';
import { VoimassaoloTieto } from '@/utils/voimassaolo';
import EpVoimassaolo from '@shared/components/EpVoimassaolo/EpVoimassaolo.vue';
import { OpetussuunnitelmaDto } from '@shared/api/amosaa';

@Component({
  components: {
    EpVoimassaolo,
  },
})
export default class OpetussuunnitelmaTile extends Vue {
  @Prop({ required: true })
  private ops!: OpetussuunnitelmaDto;

  @Prop({ default: '' })
  private query!: string;

  @Prop({ required: false })
  private voimassaoloTiedot!: VoimassaoloTieto[];

  @Prop({ required: false, default: false, type: Boolean })
  private showJotpaInfo!: Boolean;

  @Prop({ required: false, default: true, type: Boolean })
  private showOpsIcon?: boolean;

  get nimi() {
    return highlight(this.$kaanna((this.ops.nimi as Object)), this.query);
  }

  get toimijat() {
    return _.map((this.ops as any).toimijat, (toimija) => highlight(this.$kaanna(toimija.nimi), this.query));
  }

  get oppilaitokset() {
    return _.map((this.ops as any).oppilaitokset, (oppilaitos) => highlight(this.$kaanna(oppilaitos.nimi), this.query));
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

@include shadow-tile-hover;

  .otsikko {
    font-weight: 600;
  }

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
    padding: 13px 13px 13px 0;
    color: #212529;

    .ops {
      font-weight: 600;
      margin-bottom: 5px;
    }

    &__jotpa {
      padding: 2px 15px;
      display: inline-block;
      color: $white;
      background-color: $koulutustyyppi-muu-color;
      border-radius: 1rem;
      font-size: 0.8rem;
    }
  }

  .perusteen-nimi {
    padding: 20px;
  }

  .organisaatiot {
    color: #2B2B2B;
    font-size: smaller;
  }

  .meta {
    margin-bottom: 4px;
  }
</style>
