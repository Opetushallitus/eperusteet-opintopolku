import _ from 'lodash';
import { PerusteDto, Matala } from '@shared/api/tyypit';
import { Kielet } from '@shared/stores/kieli';
import { Location } from 'vue-router';
import { Sisallot } from '@shared/api/eperusteet';

export type SidenavType =
  'root' | 'viite' | 'tiedot' | 'laajaalaiset' | 'oppiaineet';

export interface SidenavNode {
  key?: number; // Unique identifier
  label: string;
  type: SidenavType;
  children: SidenavNode[];
  path: SidenavNode[]; // parent polku rootiin saakka, alkioiden määrä määrittää syvyyden. Sisältää myös nykyisen.
  location?: Location;
  isMatch?: boolean;
  isVisible?: boolean;

}

export interface SidenavFilter {
  label: string;
  isEnabled: boolean;
}

export function buildSidenav(peruste: PerusteDto, nodes: Array<SidenavNode>): SidenavNode {
  const rakenne = buildRoot(peruste, [
    buildTiedot(peruste),
    ..._.filter(_.flattenDeep(_.cloneDeep(nodes))),
  ]);
  setParents(rakenne, [rakenne]);
  return rakenne;
}

export function filterSidenav(node: SidenavNode, navfilter: SidenavFilter): SidenavNode {
  if (navfilter.isEnabled) {
    return {
      ...node,
      children: _(node.children)
        .map(child => filterSidenav(child, navfilter))
        .filter(child => child.isMatch || !_.isEmpty(child.children))
        .value(),
      isMatch: checkMatch(node, navfilter),
    };
  }
  else {
    return node;
  }
}

let nextKey = 0;

function setParents(node: SidenavNode, path: SidenavNode[] = []) {
  node.path = path;
  node.key = ++nextKey;
  if (node.location && node.location.params) {
    node.location.params = _.mapValues(node.location.params, param => '' + param);
  }
  for (const child of node.children) {
    setParents(child, [...path, child]);
  }
}

function buildRoot(peruste: PerusteDto, children: SidenavNode[]): SidenavNode {
  return {
    type: 'root',
    label: 'root',
    children: [
      ...children,
    ],
    path: [],
  };
}

function buildTiedot(peruste: PerusteDto): SidenavNode {
  return {
    type: 'tiedot',
    label: handleLabel('tiedot'),
    path: [],
    location: {
      name: 'perusteTiedot',
      params: {
        perusteId: _.toString(peruste.id),
      }
    },
    children: [],
  };
}

function nodeToRoute(lapsi: Matala): Location | undefined {
  if (lapsi.perusteenOsa) {
    return {
      name: 'tekstikappale',
      params: {
        viiteId: '' + lapsi.id,
      },
    };
  }
}

export function traverseSisalto(sisalto: Matala): SidenavNode[] {
  return (sisalto.lapset || [])
    .map((lapsi: Matala) => {
      const child: SidenavNode = {
        label: handleLabel(lapsi.perusteenOsa!.nimi || 'nimeton'),
        children: traverseSisalto(lapsi),
        path: [],
        type: 'viite',
        location: nodeToRoute(lapsi),
      };

      return child;
    });
}

function checkMatch(node: SidenavNode, filter?: SidenavFilter) {
  return filter && Kielet.search(filter.label, node.label);
}

export function handleLabel(label) {
  if (_.isObject(label)) {
    return Kielet.kaanna(label);
  }
  else if (_.isString(label)) {
    return Kielet.t(label);
  }
  else {
    return label;
  }
}
