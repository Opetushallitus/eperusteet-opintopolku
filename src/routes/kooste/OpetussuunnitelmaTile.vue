<template>
  <div
    class="opetussuunnitelma shadow-tile"
    @mouseover="$emit('mouseover', $event)"
  >
    <div class="d-flex align-items-center">
      <div
        v-if="showOpsIcon"
        class="opsicon-wrapper"
      >
        <slot name="icon">
          <img
            :src="opskorttiImage"
            class="opsicon"
          >
        </slot>
      </div>
      <div class="nimi flex-fill">
        <div class="ops d-flex align-items-center">
          <div v-html="nimi" />
          <div
            v-if="props.ops.jotpatyyppi && props.showJotpaInfo"
            class="nimi__jotpa ml-2"
          >
            {{ $t('jotpa') }}
          </div>
        </div>
        <div class="organisaatiot">
          <div
            v-if="props.voimassaoloTiedot && props.voimassaoloTiedot.length > 0"
            class="meta d-flex"
          >
            <div
              v-for="(voimassaolotieto, index) in props.voimassaoloTiedot"
              :key="'voimassa' + index"
            >
              <div v-if="voimassaolotieto.paiva">
                <span v-if="index > 0"> | </span>
                <span class="otsikko">{{ $t(voimassaolotieto.teksti) }}: </span>
                <span>{{ $sd(voimassaolotieto.paiva) }}</span>
              </div>
            </div>
            <EpVoimassaolo :voimassaolo="props.ops" />
          </div>
          <div
            v-if="props.ops.toimijat && props.ops.toimijat.length > 0"
            class="meta mr-2"
          >
            <span class="otsikko">{{ $t('toimijat') }}</span>
            <span class="mr-1">:</span>
            <span
              v-for="(toimija, tidx) in toimijat"
              :key="tidx"
              class="toimijat"
            >
              <span v-html="toimija" /><span v-if="tidx < props.ops.toimijat.length - 1">, </span>
            </span>
          </div>
          <div
            v-if="props.ops.oppilaitokset && props.ops.oppilaitokset.length > 0"
            class="meta mr-2"
          >
            <span class="otsikko">{{ $t('oppilaitokset') }}</span>
            <span class="mr-1">:</span>
            <span
              v-for="(oppilaitos, tidx) in oppilaitokset"
              :key="tidx"
              class="toimijat"
            >
              <span v-html="oppilaitos" /><span v-if="tidx < props.ops.oppilaitokset.length - 1">, </span>
            </span>
          </div>
          <div
            v-if="props.ops.koulutustoimija"
            class="meta"
          >
            <span class="otsikko">{{ $t('organisaatiot') }}</span>
            <span class="mr-1">:</span>
            <span class="toimijat">{{ $kaanna(props.ops.koulutustoimija.nimi) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { highlight } from '@/utils/kieli';
import _ from 'lodash';
import { VoimassaoloTieto } from '@/utils/voimassaolo';
import EpVoimassaolo from '@shared/components/EpVoimassaolo/EpVoimassaolo.vue';
import { OpetussuunnitelmaDto } from '@shared/api/amosaa';
import opskorttiImage from '@assets/img/images/opskortti.svg';
import { $t, $kaanna, $sd } from '@shared/utils/globals';

const props = defineProps({
  ops: {
    type: Object as () => OpetussuunnitelmaDto,
    required: true,
  },
  query: {
    type: String,
    default: '',
  },
  voimassaoloTiedot: {
    type: Array as () => VoimassaoloTieto[],
    required: false,
  },
  showJotpaInfo: {
    type: Boolean,
    required: false,
    default: false,
  },
  showOpsIcon: {
    type: Boolean,
    required: false,
    default: true,
  },
});

const emit = defineEmits(['mouseover']);

const nimi = computed(() => {
  return highlight($kaanna((props.ops.nimi as Object)), props.query);
});

const toimijat = computed(() => {
  return _.map((props.ops as any).toimijat, (toimija) => highlight($kaanna(toimija.nimi), props.query));
});

const oppilaitokset = computed(() => {
  return _.map((props.ops as any).oppilaitokset, (oppilaitos) => highlight($kaanna(oppilaitos.nimi), props.query));
});
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
