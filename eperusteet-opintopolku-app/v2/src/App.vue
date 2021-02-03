<template>
<div>
  <router-view />
  <notifications style="margin-right: 6px; margin-top: 90px;"
                 position="top right"
                 :max="3" />
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as _ from 'lodash';

@Component
export default class App extends Vue {
  mounted() {
    if (!this.localDev) {
      let recaptchaScript = document.createElement('script');
      recaptchaScript.setAttribute('id', 'apply-modal');
      recaptchaScript.setAttribute('type', 'text/javascript');
      recaptchaScript.setAttribute('src', this.opintopolkuUrl + '/oppija-raamit/js/apply-modal.js');
      document.head.appendChild(recaptchaScript);
    }
  }

  get localDev() {
    return _.includes(window.location.origin, 'localhost');
  }

  get opintopolkuUrl() {
    const origin = window.location.origin;
    return origin.replace('eperusteet.', '');
  }
}
</script>

<style lang="scss" src="@shared/styles/app.scss"></style>
