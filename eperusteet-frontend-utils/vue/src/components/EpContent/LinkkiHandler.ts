import { Location } from 'vue-router';
import { NavigationNodeDto } from '@shared/tyypit';

export interface ILinkkiHandler {
  nodeToRoute: (node: NavigationNodeDto) => Location | null,
}
