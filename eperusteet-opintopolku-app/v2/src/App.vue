<template>
<div v-if="!isInitializing">
  <router-view />
  <notifications style="margin-right: 6px; margin-top: 90px"
                 position="top right"
                 :max="3" />
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Kielet } from 'eperusteet-frontend-utils/vue/src/stores/kieli';
import { delay } from 'eperusteet-frontend-utils/vue/src/utils/delay';


@Component
export default class App extends Vue {
  private isInitializing = true;

  public async mounted() {
    const loader = (this as any).$loading.show({
      color: '#2E5FD1',
    });

    await Kielet.init();
    await delay(500);
    this.isInitializing = false;
    loader.hide();
  }
}
</script>

<style lang="scss" src="./styles/app.scss" />
