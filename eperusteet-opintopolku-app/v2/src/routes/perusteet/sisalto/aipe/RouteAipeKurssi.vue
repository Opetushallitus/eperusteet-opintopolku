<template>
  <div class="content">
    <h2>{{$kaanna(kurssi.nimi)}}</h2>

    <div class="mt-4" v-if="kurssi.koodi">
      <h3>{{ $t('koodi')}}</h3>
      <span>{{kurssi.koodi.arvo}}</span>
    </div>

    <div class="mt-4" v-if="kurssi.kuvaus">
      <h3>{{ $t('kuvaus')}}</h3>
      <span v-html="$kaanna(kurssi.kuvaus)"></span>
    </div>

    <div class="mt-5" v-if="tavoitteet && tavoitteet.length > 0">
      <h3>{{$t('liitetyt-tavoitteet')}}</h3>
      <b-table striped :items="tavoitteet" :fields="fields">
        <template v-slot:cell(tavoite)="data">
          {{$kaanna(data.item.tavoite)}}
        </template>
      </b-table>
    </div>

  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { AipeKurssiStore } from '@/stores/AipeKurssiStore';

@Component
export default class RouteAipeKurssi extends Vue {
  @Prop({ required: true })
  private aipeKurssiStore!: AipeKurssiStore;

  get kurssi() {
    return this.aipeKurssiStore.kurssi.value;
  }

  get tavoitteet() {
    if (this.aipeKurssiStore.kurssi.value) {
      return _.map(this.aipeKurssiStore.kurssi.value.tavoitteet, tavoite => (this.tavoitteetById![tavoite as any]));
    }
  }

  get tavoitteetById() {
    if (this.aipeKurssiStore.oppiaine.value) {
      return _.keyBy(this.aipeKurssiStore.oppiaine.value.tavoitteet, 'id');
    }
  }

  get fields() {
    return [{
      key: 'tavoite',
      thStyle: {
        display: 'none',
      },
    }];
  }
}

</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content {
  padding: 0 $content-padding;
}
</style>
