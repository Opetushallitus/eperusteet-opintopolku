import _ from 'lodash';
import { Matala } from '@shared/api/tyypit';
import { Kielet } from '@shared/stores/kieli';
import { RawLocation } from 'vue-router';


export interface SidenavNode {
  id?: number;
  label: string;
  depth: number;
  to?: RawLocation;
  isVisible: boolean,
  isFiltered: boolean;
  isMatch: boolean;
  isCollapsed: boolean;
  type: 'root' | 'viite' | 'tiedot';
  perusteenOsa?: object; // todo oikea tyyppi
  children: Array<SidenavNode>;
  path: Array<SidenavNode>;
}

export interface SidenavFilter {
  label: string;
  isEnabled: boolean;
}

export function nodeToRoute(lapsi: Matala): RawLocation | undefined {
  if (lapsi.perusteenOsa) {
    return {
      name: 'tekstikappale',
      params: {
        viiteId: lapsi.id as any,
      },
    };
  }
}

export function traverseSisalto(viiteId: number, sisalto: Matala, path: Array<SidenavNode>, filter: SidenavFilter): SidenavNode[] {
  return (sisalto.lapset || [])
    .map((lapsi: Matala) => {
      const child: SidenavNode = {
        id: lapsi.id,
        label: handleLabel(lapsi.perusteenOsa!.nimi || 'nimeton'),
        depth: path.length,
        isVisible: true,
        isFiltered: false,
        isMatch: false,
        isCollapsed: false,
        perusteenOsa: lapsi.perusteenOsa,
        children: [],
        path,
        type: 'viite',
        to: nodeToRoute(lapsi),
      };

      // Collapse if not open
      handleCollapse(viiteId, child, path);

      // Filter by label
      handleFilter(child, path, filter);

      child.children = traverseSisalto(viiteId, lapsi, [...path, child], filter);
      return child;
    });
}

function handleCollapse(viiteId: number, child, path) {
  if (viiteId && viiteId === child.id) {
    child.isCollapsed = false;
    for (const node of path) {
      node.isCollapsed = false;
    }
  }
  else {
    child.isCollapsed = true;
  }
}

function handleFilter(child, path, filter) {
  if (Kielet.search(filter.label, child.label)) {
    child.isFiltered = true;
    child.isMatch = true;
    for (const node of path) {
      node.isFiltered = true;
    }
  }
}

function handleLabel(label) {
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

export function buildYksinkertainenNavigation(viiteId: string | number, perusteId: number, sisalto: Matala, filter: SidenavFilter): SidenavNode {
  const root: SidenavNode = {
    type: 'root',
    label: 'root',
    depth: 0,
    isVisible: false,
    isFiltered: false,
    isMatch: false,
    isCollapsed: false,
    children: [],
    path: [],
  };

  // Lisätään vapaat tekstikappaleet
  root.children = traverseSisalto(
    _.isString(viiteId) ? _.parseInt(viiteId) : viiteId,
    sisalto,
    [
      root
    ],
    filter);

  // Lisätään tiedot
  const tiedot: SidenavNode = {
    type: 'tiedot',
    label: handleLabel('tiedot'),
    depth: 1,
    isVisible: true,
    isFiltered: false,
    isMatch: false,
    isCollapsed: false,
    to: {
      name: 'perusteTiedot',
      params: {
        perusteId: perusteId as any,
      }
    },
    children: [],
    path: [
      root
    ],
  };

  handleFilter(tiedot, [], filter);
  root.children.unshift(tiedot);

  return root;
}
