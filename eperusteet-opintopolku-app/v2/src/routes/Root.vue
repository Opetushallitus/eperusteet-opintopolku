<template>
<div>
  <a class="sr-only sr-only-focusable skip-to-content" href="#main">{{ $t('siirry-sisaltoon') }}</a>
  <EpFeedbackModal/>
  <ep-navigation role="banner"></ep-navigation>
  <main class="router-container" role="main">
    <router-view />
  </main>
  <ep-footer />
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Component, Vue } from 'vue-property-decorator';
import EpFooter from '@/components/EpFooter/EpFooter.vue';
import EpNavigation from '@/components/EpNavigation/EpNavigation.vue';
import EpFeedbackModal from '@/components/EpFeedbackModal/EpFeedbackModal.vue';
import { Meta } from '@shared/utils/decorators';

@Component({
  components: {
    EpFooter,
    EpNavigation,
    EpFeedbackModal,
  },
})
export default class Root extends Vue {
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
}
</script>

<style lang="scss">
@import '@shared/styles/_variables.scss';

header {
  background-color: white;
}

main.router-container {
  min-height: calc(100vh - 400px);
  margin-bottom: 40px;
}

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
