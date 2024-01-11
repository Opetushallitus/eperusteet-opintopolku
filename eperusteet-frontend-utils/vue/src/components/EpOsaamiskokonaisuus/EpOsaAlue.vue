<template>
  <div class="osa-alue">
    <div v-if="isEditing">
      <b-form-group >
        <div slot="label" class="d-flex justify-content-between">
          <div>{{$t('osa-alueen-nimi')}}</div>
          <slot name="poisto"></slot>
        </div>
        <ep-input v-model="osaAlue.nimi" :is-editing="isEditing"/>
      </b-form-group>

      <hr/>

      <b-form-group class="tasokuvaus" v-for="(tasokuvaus, index) in osaAlue.tasokuvaukset" :key="'tasokuvaus' + index" :label="$t('osa-alue-otsiko-' + tasokuvaus.taso.toLowerCase())">

          <template v-if="tasokuvaus.taso === 'ESIOPETUS' || tasokuvaus.taso === 'VUOSILUOKKA_12' || tasokuvaus.taso === 'VUOSILUOKKA_3456' || tasokuvaus.taso === 'VUOSILUOKKA_789'">
            <div class="mt-3 mb-2 edelleen-kehittyva-osaaminen">{{$t('edelleen-kehittyva-osaaminen')}}</div>
            <EpOsaAlueSisalto :isEditing="isEditing" v-model="tasokuvaus.edelleenKehittyvatOsaamiset" />
          </template>

          <div class="mt-3 mb-2 osaaminen">{{$t('osaaminen')}}</div>
          <EpOsaAlueSisalto :isEditing="isEditing" v-model="tasokuvaus.osaamiset" />

          <template v-if="tasokuvaus.taso === 'VUOSILUOKKA_12' || tasokuvaus.taso === 'VUOSILUOKKA_3456' || tasokuvaus.taso === 'VUOSILUOKKA_789'">
            <div class="mt-3 mb-2 edistynyt-osaaminen">{{$t('edistynyt-osaaminen')}}</div>
            <EpOsaAlueSisalto :isEditing="isEditing" v-model="tasokuvaus.edistynytOsaaminenKuvaukset" />
          </template>

        <hr/>
      </b-form-group>

    </div>

    <div v-else>
      <slot name="nimi">
        <h3>{{ $kaanna(osaAlue.nimi) }}</h3>
      </slot>

      <div class="tasokuvaus" v-for="(tasokuvaus, index) in osaAlue.tasokuvaukset" :key="'tasokuvaus' + index">
        <b-form-group class="mt-3 mb-0 p-0" v-if="otsikkoLkm(tasokuvaus) > 0" :label="$t('osa-alue-otsiko-' + tasokuvaus.taso.toLowerCase())">

          <div class="mt-3 edelleen-kehittyva-osaaminen" v-if="tasokuvaus.edelleenKehittyvatOsaamiset && tasokuvaus.edelleenKehittyvatOsaamiset.length > 0">
            <div class="ml-3 otsikko">{{$t('edelleen-kehittyva-osaaminen')}}</div>
            <ul class="mb-0 sisalto">
              <li v-for="(edKehOsaaminen, edKehOsaamisetIndex) in tasokuvaus.edelleenKehittyvatOsaamiset" :key="'edKehOsaaminen' + index + edKehOsaamisetIndex">{{$kaanna(edKehOsaaminen)}}</li>
            </ul>
          </div>

          <div class="mt-3 osaaminen" v-if="tasokuvaus.osaamiset && tasokuvaus.osaamiset.length > 0">
            <div class="ml-3 otsikko" v-if="tasokuvaus.edelleenKehittyvatOsaamiset && tasokuvaus.edelleenKehittyvatOsaamiset.length > 0">{{$t('osaaminen')}}</div>
            <ul class="mb-0 sisalto">
              <li v-for="(osaaminen, osaamisetIndex) in tasokuvaus.osaamiset" :key="'osaamiset' + index + osaamisetIndex">{{$kaanna(osaaminen)}}</li>
            </ul>
          </div>

          <div class="mt-3 edistynyt-osaaminen" v-if="tasokuvaus.edistynytOsaaminenKuvaukset && tasokuvaus.edistynytOsaaminenKuvaukset.length > 0">
            <div class="ml-3 otsikko">{{$t('edistynyt-osaaminen')}}</div>
            <ul class="mb-0 sisalto">
              <li v-for="(edistynytKuvaus, kuvausIndex) in tasokuvaus.edistynytOsaaminenKuvaukset" :key="'edistynytkuvaus' + index + kuvausIndex">{{$kaanna(edistynytKuvaus)}}</li>
            </ul>
          </div>
        </b-form-group>

        <slot name="tasokuvaus-postfix" />
      </div>

    </div>

  </div>

</template>

<script lang="ts">
import * as _ from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';
import EpInput from '@shared/components/forms/EpInput.vue';
import { Kielet } from '@shared/stores/kieli';
import draggable from 'vuedraggable';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpOsaAlueSisalto from './EpOsaAlueSisalto.vue';

@Component({
  components: {
    EpInput,
    draggable,
    EpButton,
    EpOsaAlueSisalto,
  },
})
export default class EpOsaAlue extends Vue {
  @Prop({ required: true })
  value!: any;

  @Prop({ required: false, default: false })
  isEditing!: boolean;

  get osaAlue() {
    return this.value;
  }

  set osaAlue(val) {
    this.$emit('input', val);
  }

  otsikkoLkm(tasokuvaus) {
    return (tasokuvaus.osaamiset?.length > 0 ? 1 : 0) + (tasokuvaus.edelleenKehittyvatOsaamiset?.length > 0 ? 1 : 0) + (tasokuvaus.edistynytOsaaminenKuvaukset?.length > 0 ? 1 : 0);
  }

  get defaultDragOptions() {
    return {
      animation: 300,
      emptyInsertThreshold: 10,
      handle: '.order-handle',
      disabled: !this.isEditing,
      ghostClass: 'dragged',
      group: {
        name: 'kuvaukset',
      },
    };
  }

  get sisaltokieli() {
    return Kielet.getSisaltoKieli.value;
  }

  poistaKuvaus(listaKentta, kuvaus, taso) {
    this.$emit('input', {
      ...this.osaAlue,
      tasokuvaukset: _.map(this.osaAlue.tasokuvaukset, tasokuvaus => tasokuvaus.taso === taso ? { ...tasokuvaus, [listaKentta]: _.filter(tasokuvaus[listaKentta], tkuvaus => tkuvaus !== kuvaus) } : tasokuvaus),
    });
  }

  lisaaKuvaus(listaKentta, taso) {
    this.$emit('input', {
      ...this.osaAlue,
      tasokuvaukset: _.map(this.osaAlue.tasokuvaukset, tasokuvaus => tasokuvaus.taso === taso ? { ...tasokuvaus, [listaKentta]: [...tasokuvaus[listaKentta], {}] } : tasokuvaus),
    });
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

</style>
