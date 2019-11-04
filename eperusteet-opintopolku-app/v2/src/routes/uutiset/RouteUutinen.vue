<template>
<div>
  <ep-header :murupolku="murupolku" :koulutustyyppi="koulutustyyppi">
    <template slot="header">
      <div v-if="tiedote">
        {{ $kaanna(tiedote.otsikko) }}
      </div>
      <ep-spinner v-else />
    </template>
    <div v-if="tiedote" class="tiedote">
      <div class="otsikko">
        {{ $kaanna(tiedote.otsikko) }}
      </div>
      <div class="aikaleima">
        {{ $sd(tiedote.luotu) }}
      </div>
      <div class="tiedote-sisalto">
        <p v-html="$kaanna(tiedote.sisalto)"></p>
      </div>
    </div>
    <ep-spinner v-else />
  </ep-header>
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Prop, Component, Vue } from 'vue-property-decorator';
import { TiedoteStore } from '@/stores/TiedoteStore';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import { Meta } from '@shared/utils/decorators';

@Component({
  components: {
    EpSpinner,
    EpHeader,
    EpSearch,
  },
})
export default class RouteUutinen extends Vue {
  @Prop({ required: true })
  private tiedoteStore!: TiedoteStore;
  private page = 1;
  private query = '';

  mounted() {
    if (this.$route) {
      this.tiedoteStore.fetchUutinen(_.parseInt(this.$route.params.tiedoteId));
    }
  }

  get tiedote() {
    return this.tiedoteStore.tiedote;
  }

  get koulutustyyppi() {
    if (this.tiedote && this.tiedote.peruste) {
      return this.tiedote.peruste.koulutustyyppi;
    }
  }

  get murupolku() {
    const murut = [{
      label: 'uutiset',
      location: {
        name: 'uutiset',
      },
    }];

    if (this.tiedote) {
      murut.push({
        label: this.tiedote.otsikko,
        location: {
          name: 'uutinen',
          params: {
            tiedoteId: this.tiedote.id
          }
        }
      } as any);
    }

    return murut;
  }

  @Meta
  getMetaInfo() {
    if (this.tiedote) {
      return {
        title: (this as any).$kaanna(this.tiedote.otsikko),
      };
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../styles/_variables.scss';

.tiedote {
  padding-left: 15px;
  padding-right: 15px;

  .otsikko {
    color: #001A58;
    font-size: 1.5rem;
  }

  .aikaleima {
    color: #555;
    font-weight: lighter;
  }

  .tiedote-sisalto {
    margin-top: 10px;
  }
}

</style>

