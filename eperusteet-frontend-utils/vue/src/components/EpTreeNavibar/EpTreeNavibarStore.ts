import Vue from 'vue';
import VueCompositionApi, { reactive, computed } from '@vue/composition-api';
import { Location } from 'vue-router';
import { Computed } from '@shared/utils/interfaces';
import { LokalisoituTekstiDto, NavigationNodeType, NavigationNodeDto } from '@shared/tyypit';
import _ from 'lodash';

Vue.use(VueCompositionApi);

interface NodeConfig {
  disableNesting?: boolean;
}

type NodeConfigs = { [type: string]: NodeConfig | undefined | null };

export interface FlattenedNodeDto {
  id?: number;
  label?: LokalisoituTekstiDto;
  type?: NavigationNodeType;
  meta?: { [key: string]: object; };
  depth: number;
  chapter: string;
  children: NavigationNodeDto[];
}

export class EpTreeNavibarStore {
  constructor(
    private navigation: Computed<NavigationNodeDto>,
    private readonly routeToNodeImpl: (route: Location) => NavigationNodeDto | null,
    private config: NodeConfigs = {
    },
  ) {
  }

  public routeToNode(route: Location) {
    return this.routeToNodeImpl(route);
  }

  public readonly connected = computed(() => {
    return _.drop(flattenNodes(this.config, this.navigation.value), 1);
  });

  public readonly filtered = computed(() => this.connected.value);
}

function flattenNodes(config: NodeConfigs, root: NavigationNodeDto, depth = 0, parents: number[] = []): FlattenedNodeDto[] {
  if (!root) {
    return [];
  }
  const tconfig = config[root.type!];
  const nextDepth = tconfig?.disableNesting ? depth : depth + 1;
  return [{
    id: root.id,
    label: root.label,
    type: root.type,
    meta: root.meta,
    children: tconfig?.disableNesting ? [] : root.children as any,
    chapter: _.join(_.map(parents, p => p + 1), '.'),
    depth,
  }, ..._.flatten(_.map(root.children, (child, idx) => flattenNodes(
    config,
    child,
    nextDepth,
    [...parents, idx])))];
}
