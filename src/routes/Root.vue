<template>
  <div>
    <EpJulkinenSidenav
      :julkaistut-koulutustyypit-store="julkaistutKoulutustyypitStore"
      :tietoapalvelusta-store="tietoapalvelustaStore"
      :osaamismerkit-store="osaamismerkitStore"
    />
    <main role="main">
      <router-view />
    </main>
    <ep-footer />
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Component, Prop, Provide, ProvideReactive, Vue, Watch } from 'vue-property-decorator';
import EpFooter from '@/components/EpFooter/EpFooter.vue';
import { Meta } from '@shared/utils/decorators';
import { JulkaistutKoulutustyypitStore } from '@/stores/JulkaistutKoulutustyypitStore';
import { Kielet } from '@shared/stores/kieli';
import EpJulkinenSidenav from '@/components/EpJulkinenSidenav/EpJulkinenSidenav.vue';
import { TietoapalvelustaStore } from '@/stores/TietoapalvelustaStore';
import { OsaamismerkitStore } from '@/stores/OsaamismerkitStore';

@Component({
  components: {
    EpJulkinenSidenav,
    EpFooter,
  },
})
export default class Root extends Vue {
  @Prop({ required: true })
  private julkaistutKoulutustyypitStore!: JulkaistutKoulutustyypitStore;

  @Prop({ required: true })
  private tietoapalvelustaStore!: TietoapalvelustaStore;

  @Prop({ required: true })
  private osaamismerkitStore!: OsaamismerkitStore;

  async mounted() {
    await Promise.all([this.sisaltoKieliChange(), this.tietoapalvelustaStore.fetch()]);
  }

  @Watch('sisaltoKieli')
  async sisaltoKieliChange() {
    await this.julkaistutKoulutustyypitStore.fetch(this.sisaltoKieli);
  }

  get julkaistutKoulutustyypit() {
    return this.julkaistutKoulutustyypitStore.julkaistutKoulutustyypit.value;
  }

  get sisaltoKieli() {
    return Kielet.getSisaltoKieli.value;
  }

  get titleTemplate() {
    return '%s - ' + this.$t('eperusteet');
  }

  @Meta
  getMetaInfo() {
    const lang = _.get(this.$route, 'params.lang');
    return {
      titleTemplate: this.titleTemplate,
      htmlAttrs: {
        lang: lang || 'fi',
      },
      meta: [
        {
          vmid: 'description',
          name: 'description',
          content: this.$t('eperusteet-kuvaus'),
        },
        {
          vmid: 'keywords',
          name: 'keywords',
          content: this.$t('avainsanalista'),
        },
        {
          vmid: 'author',
          name: 'author',
          content: this.$t('opetushallitus'),
        },
        {
          vmid: 'og:site_name',
          property: 'og:site_name',
          content: this.$t('eperusteet'),
        },
        {
          vmid: 'og:description',
          property: 'og:description',
          content: this.$t('eperusteet-kuvaus'),
        },
        {
          vmid: 'og:locale',
          property: 'og:locale',
          content: lang + '_FI',
        },
      ],
    };
  }

  @Provide('commentingDisabled')
  get commentingDisabled() {
    return true;
  }
}
</script>

<style lang="scss">
@import '@shared/styles/_variables.scss';

.skip-to-content {
  position: absolute !important;
  z-index: 1030;
  top: 10px;
  left: 10px;
  background-color: white;
  padding: 0.6875rem !important;
  border: 1px solid gray !important;
}
</style>
