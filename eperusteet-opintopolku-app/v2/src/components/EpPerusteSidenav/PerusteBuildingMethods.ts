import _ from 'lodash';
import { Matala } from '@shared/api/tyypit';

interface SidenavNodeState {
  name: string,
  params?: object
}

export interface SidenavNode {
  id?: number,
  label: string,
  to?: SidenavNodeState,
  isVisible: boolean,
  isFiltered: boolean,
  isMatch: boolean,
  isCollapsed: boolean
  type: 'root' | 'viite' | 'tiedot',
  perusteenOsa?: object, // todo oikea tyyppi
  children?: Array<SidenavNode>
}

export interface FilterObj {
  label: string
  isEnabled: boolean
}

export function traverseSisalto(vueInstance, sisalto: Matala, path: Array<SidenavNode>, filter: FilterObj) {
  const children: Array<SidenavNode> = [];

  if (!_.isEmpty(sisalto.lapset)) {
    _.each(sisalto.lapset, (lapsi: Matala) => {
      const viiteId = vueInstance.$route.params.viiteId;
      const child: SidenavNode = {
        id: lapsi.id,
        label: handleLabel(vueInstance, lapsi.perusteenOsa!.nimi || 'nimeton'),
        isVisible: true,
        isFiltered: false,
        isMatch: false,
        isCollapsed: false,
        perusteenOsa: lapsi.perusteenOsa,
        type: 'viite',
      };

      // Add perusteen osa
      if (lapsi.perusteenOsa) {
        child['to'] = {
          name: 'tekstikappale',
          params: {
            viiteId: lapsi.id
          }
        };
      }

      // Collapse if not open
      handleCollapse(vueInstance, child, path);

      // Filter by label
      handleFilter(vueInstance, child, path, filter);

      // Rekursiivinen
      path.push(child);
      child.children = traverseSisalto(vueInstance, lapsi, path, filter);
      path.pop();

      children.push(child);
    });
  }

  return children;
}

function handleCollapse(vueInstance, child, path) {
  const viiteId = _.parseInt(_.get(vueInstance, '$route.params.viiteId'));
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

function handleFilter(vueInstance, child, path, filter) {
  if (_.includes(_.lowerCase(child.label), _.lowerCase(filter.label))) {
    child.isFiltered = true;
    child.isMatch = true;
    for (const node of path) {
      node.isFiltered = true;
    }
  }
}

function handleLabel(vueInstance, label) {
  if (_.isObject(label)) {
    return vueInstance.$kaanna(label);
  }
  else if (_.isString(label)) {
    return vueInstance.$t(label);
  }
  else {
    return label;
  }
}

export function buildYksinkertainenNavigation(vueInstance, perusteId: number, sisalto: Matala, filter: FilterObj) {
  const root: SidenavNode = {
    type: 'root',
    label: 'root',
    isVisible: false,
    isFiltered: false,
    isMatch: false,
    isCollapsed: false,
  };
  // Lisätään vapaat tekstikappaleet
  root.children = traverseSisalto(vueInstance, sisalto, [], filter);

  // Lisätään tiedot
  const tiedot: SidenavNode = {
    type: 'tiedot',
    label: handleLabel(vueInstance, 'tiedot'),
    isVisible: true,
    isFiltered: false,
    isMatch: false,
    isCollapsed: false,
    to: {
      name: 'perusteTiedot',
      params: {
        perusteId
      }
    }
  };
  handleFilter(vueInstance, tiedot, [], filter);
  root.children.unshift(tiedot);



  return root;
}
