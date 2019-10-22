<template>
<div class="content">
    <h2 class="otsikko" slot="header">{{ $t('laaja-alaiset-osaamiset') }}</h2>
</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({})
export default class RouteLaajaalaiset extends Vue {

}
</script>

<style scoped lang="scss">
@import '../../../../../styles/_variables.scss';

.content {
    padding: $content-padding;
}
</style>
