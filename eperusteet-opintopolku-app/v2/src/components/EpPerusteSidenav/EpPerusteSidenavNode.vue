<template>
<li class="node-tree" v-if="node.perusteenOsa">
    <b-link :to="{ name: 'tekstikappale', params: { osaId: node.perusteenOsa.id} }">
        <span class="label">{{ $kaanna(node.perusteenOsa.nimi) }}</span>
    </b-link>
    <ul v-if="node.children && node.children.length">
        <ep-peruste-sidenav-node v-for="(child, idx) in node.children"
                                      :key="idx"
                                      :node="child"></ep-peruste-sidenav-node>
    </ul>
</li>
<li class="node-tree" v-else-if="node.tyyppi === 'tiedot'">
    <b-link :to="{ name: 'perusteTiedot', params: { perusteId: node.perusteId } }">
        <span class="label">{{ $t('perusteen-tiedot') }}</span>
    </b-link>
</li>
<div class="node-tree skip" v-else>
    <ep-peruste-sidenav-node v-for="(child, idx) in node.children"
                             :key="idx"
                             :node="child"></ep-peruste-sidenav-node>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: {
    EpPerusteSidenavNode
  }
})
export default class EpPerusteSidenavNode extends Vue {
  @Prop({ required: true })
  private node!: object;

}
</script>

<style scoped lang="scss">
@import '../../styles/_variables.scss';

.node-tree {
    ul {
        // Remove default list styles
        list-style: none;
        padding-left: $sidenav-depth-padding;
    }

    .router-link-active {
        font-weight: bold;
    }
}
</style>
