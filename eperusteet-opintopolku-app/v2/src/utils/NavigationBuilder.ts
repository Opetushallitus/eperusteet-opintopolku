import _ from 'lodash';
import { PerusteDto, Matala, Laaja } from '@shared/api/tyypit';
import { Koulutustyyppi, KoulutustyyppiToteutus } from '@shared/tyypit';
import { Kielet } from '@shared/stores/kieli';
import { RawLocation } from 'vue-router';

export interface SidenavNodeBase {
  label: string;
  type: 'root' | 'viite' | 'tiedot';
  children: Array<SidenavNode>;
  path: Array<SidenavNode>; // polku rootista, alkioiden määrä määrittää syvyyden
}

export interface SidenavNodeFilter {
  isVisible: boolean,
  isFiltered: boolean;
  isMatch: boolean;
  isCollapsed: boolean;
}

export interface SidenavNodeRoute {
  to?: RawLocation;
}

export interface SidenavNode extends SidenavNodeBase, SidenavNodeFilter, SidenavNodeRoute {
  id?: number;
  perusteenOsa?: Laaja;
}

export interface SidenavFilter {
  label: string;
  isEnabled: boolean;
}

/**
 * Rakennetaan sivunavigaatio
 * @param peruste Peruste
 * @param sisalto Perusteen sisältö
 * @param filter  Rajaus
 * @param viiteId Nykyisen tilan viite id jos määritetty
 */
export function buildSidenav(peruste: PerusteDto, sisalto: Matala, filter?: SidenavFilter, viiteId?: number): SidenavNode {
  const koulutustyyppi = peruste.koulutustyyppi ? Koulutustyyppi[peruste.koulutustyyppi] : undefined;
  const koulutustyyppiToteutus = peruste.toteutus ? KoulutustyyppiToteutus[peruste.toteutus] : undefined;
  console.log('buildSidenav', koulutustyyppi, koulutustyyppiToteutus);

  // Kaikille koulutustyypeille ja toteutuksille tehtävät
  const root = buildTreeBase(peruste, sisalto, filter, viiteId);

  // Rakenne perustepalvelun mukaisesta sisällöstä
  if (koulutustyyppi) {
    switch (koulutustyyppi) {
      case Koulutustyyppi.lisaopetus:
      case Koulutustyyppi.esiopetus:
      case Koulutustyyppi.varhaiskasvatus:
      case Koulutustyyppi.perusopetusvalmistava:
        // todo
        break;
      case Koulutustyyppi.perusopetus:
        // todo
        break;
      case Koulutustyyppi.aikuistenperusopetus:
        // todo
        break;
      case Koulutustyyppi.lukiokoulutus:
      case Koulutustyyppi.lukiovalmistavakoulutus:
      case Koulutustyyppi.aikuistenlukiokoulutus:
        if (koulutustyyppiToteutus && koulutustyyppiToteutus === KoulutustyyppiToteutus.lops2019) {
          // todo
          break;
        }
        else {
          // todo
          break;
        }
      case Koulutustyyppi.tpo:
        // todo
        break;
      case Koulutustyyppi.telma:
      case Koulutustyyppi.perustutkinto:
      case Koulutustyyppi.ammattitutkinto:
      case Koulutustyyppi.erikoisammattitutkinto:
        // todo
        break;
      default:
        throw new Error('koulutustyyppin-sivunavigaatio-ei-toteutettu');
    }
  }

  return root;
}

function buildTreeBase(peruste: PerusteDto, sisalto: Matala, filter?: SidenavFilter, viiteId?: number): SidenavNode {
  const root: SidenavNode = {
    type: 'root',
    label: 'root',
    isVisible: false,
    isFiltered: false,
    isMatch: false,
    isCollapsed: false,
    children: [],
    path: [],
  };

  buildTiedot(peruste, root, filter);
  buildVapaatTekstikappaleet(sisalto, root, filter, viiteId);

  return root;
}

function buildTiedot(peruste: PerusteDto, root: SidenavNode, filter?: SidenavFilter) {
  const tiedot: SidenavNode = {
    type: 'tiedot',
    label: handleLabel('tiedot'),
    isVisible: true,
    isFiltered: false,
    isMatch: false,
    isCollapsed: false,
    to: {
      name: 'perusteTiedot',
      params: {
        perusteId: _.toString(peruste.id),
      }
    },
    children: [],
    path: [
      root
    ],
  };

  handleFilter(tiedot, [], filter);
  root.children.unshift(tiedot);
}

function buildVapaatTekstikappaleet(sisalto: Matala, root: SidenavNode, filter?: SidenavFilter, viiteId?: number) {
  root.children.push(...traverseSisalto(
      sisalto,
      [
        root
      ],
      filter,
      viiteId));
}

function nodeToRoute(lapsi: Matala): RawLocation | undefined {
  if (lapsi.perusteenOsa) {
    return {
      name: 'tekstikappale',
      params: {
        viiteId: lapsi.id as any,
      },
    };
  }
}

function traverseSisalto(
    sisalto: Matala,
    path: Array<SidenavNode>,
    filter?: SidenavFilter,
    viiteId?: number
): SidenavNode[] {
  return (sisalto.lapset || [])
    .map((lapsi: Matala) => {
      const child: SidenavNode = {
        id: lapsi.id,
        label: handleLabel(lapsi.perusteenOsa!.nimi || 'nimeton'),
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
      handleCollapse(child, path, viiteId);

      // Filter by label
      handleFilter(child, path, filter);

      child.children = traverseSisalto(lapsi, [...path, child], filter, viiteId);
      return child;
    });
}

function handleCollapse(child: SidenavNode, path: Array<SidenavNode>, viiteId?: number) {
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

function handleFilter(child: SidenavNode, path: Array<SidenavNode>, filter?: SidenavFilter) {
  if (filter && Kielet.search(filter.label, child.label)) {
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
