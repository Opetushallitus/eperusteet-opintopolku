<template>
  <b-table striped :items="arvioinninKohteetSorted" :fields="sarakkeet"/>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import * as _ from 'lodash';

@Component
export default class EpArvioinninkohteetTable extends Vue {
  @Prop({ required: true })
  private arvioinninkohteet!: any[];

  get arvioinninKohteetSorted() {
    return _.sortBy(this.arvioinninkohteet, 'arvosana');
  }

  get osaamisenKuvauksetTyhjia() {
    return _.size(_.filter(this.arvioinninkohteet, kohde => kohde.arvosana !== null)) === 0;
  }

  get sarakkeet() {
    if (this.osaamisenKuvauksetTyhjia) {
      return [
        this.osaamisenKuvausSarake,
      ];
    }

    return [
      this.arvosanaSarake,
      this.osaamisenKuvausSarake,
    ];
  }

  get arvosanaSarake() {
    return {
      key: 'arvosana',
      label: this.$t('arviointitaulukko-arvosana-otsikko'),
      thStyle: { width: '30%' },
      formatter: (value, key, item) => {
        if (value) {
          return (this as any).$t('osaamisen-kuvaus-arvosanalle_' + value);
        }

        return '';
      },
    };
  }

  get osaamisenKuvausSarake() {
    return {
      key: 'osaamisenKuvaus',
      label: this.$t('arviointitaulukko-osaaminen-otsikko'),
      formatter: (value, key, item) => {
        return (this as any).$kaanna(value);
      },
    };
  }
}
</script>

<style lang="scss" scoped>

</style>
