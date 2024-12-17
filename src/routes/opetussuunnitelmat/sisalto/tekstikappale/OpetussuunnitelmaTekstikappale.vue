<template>
  <div class="content">
    <div v-if="!!tekstiKappaleViite">

      <OpetussuunnitelmaTekstikappaleSisalto
        :opetussuunnitelmaDataStore="opetussuunnitelmaDataStore"
        :tekstiKappaleViite="tekstiKappaleViite">

        <template v-slot:header>
          <h2 id="tekstikappale-otsikko" class="otsikko">
            <span v-if="numerointi">{{numerointi}}</span>
            {{ $kaanna(tekstiKappale.nimi) }}
          </h2>
        </template>
      </OpetussuunnitelmaTekstikappaleSisalto>

      <div v-if="alikappaleet">
        <div v-for="(alikappaleViite, idx) in alikappaleet" :key="idx">
          <OpetussuunnitelmaTekstikappaleSisalto
            :opetussuunnitelmaDataStore="opetussuunnitelmaDataStore"
            :tekstiKappaleViite="alikappaleViite">

            <template v-slot:header>
              <ep-heading class="aliotsikko" :level="alikappaleViite.level + 2">
                <span v-if="alikappaleNumeroinnitById[alikappaleViite.id]">{{alikappaleNumeroinnitById[alikappaleViite.id]}}</span>
                {{ $kaanna(alikappaleViite.tekstiKappale.nimi) }}
              </ep-heading>
            </template>
          </OpetussuunnitelmaTekstikappaleSisalto>

        </div>
      </div>

      <slot name="previous-next-navigation" />
    </div>
    <ep-spinner v-else />
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop } from 'vue-property-decorator';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpHeading from '@shared/components/EpHeading/EpHeading.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';
import { OpetussuunnitelmaDataStore } from '@/stores/OpetussuunnitelmaDataStore';
import { Puu } from '@shared/api/ylops';
import OpetussuunnitelmaTekstikappaleSisalto from './OpetussuunnitelmaTekstikappaleSisalto.vue';

@Component({
  components: {
    EpSpinner,
    EpHeading,
    EpContentViewer,
    EpCollapse,
    OpetussuunnitelmaTekstikappaleSisalto,
  },
})
export default class OpetussuunnitelmaTekstikappale extends Vue {
  @Prop({ required: true })
  private opetussuunnitelmaDataStore!: OpetussuunnitelmaDataStore;

  get tekstiKappaleViite() {
    return this.opetussuunnitelmaDataStore.getJulkaistuSisalto({ id: _.toNumber(this.$route.params.viiteId) });
  }

  get tekstiKappale() {
    return this.tekstiKappaleViite.tekstiKappale;
  }

  get alikappaleet() {
    if (!_.isEmpty(this.tekstiKappaleViite)) {
      const viitteet: Puu[] = [];
      const stack: Puu[] = [this.tekstiKappaleViite!];

      while (!_.isEmpty(stack)) {
        const head: any = stack.shift()!;

        if (head.tekstiKappale) {
          viitteet.push(head);
        }

        stack.unshift(..._.map(head.lapset, viite => ({
          ...viite,
          level: (head.level || 0) + 1,
        })));
      }

      return _.slice(_.reject(viitteet, 'piilotettu'), 1);
    }
    else {
      return [];
    }
  }

  get current() {
    return this.opetussuunnitelmaDataStore.current || null;
  }

  get numerointi() {
    return this.current?.meta?.numerointi;
  }

  get alikappaleNumeroinnitById() {
    if (this.current?.children) {
      return this.current?.children?.reduce((acc: any, child: any) => {
        acc[child.id] = child?.meta?.numerointi;
        return acc;
      }, {});
    }

    return {};
  }
}

</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content {
  padding: 0 $content-padding;

  .aliotsikko {
    margin-top: 42px;
  }

  .collapse-header {
    font-family: 'Poppins', sans-serif;
    font-size: 1.125rem;
  }
}
</style>
