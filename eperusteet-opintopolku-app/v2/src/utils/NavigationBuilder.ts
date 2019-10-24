import _ from 'lodash';
import { PerusteDto, Matala, Laaja } from '@shared/api/tyypit';
import { Koulutustyyppi, KoulutustyyppiToteutus } from '@shared/tyypit';
import { Kielet } from '@shared/stores/kieli';
import { Location } from 'vue-router';
import { Perusteet, Sisallot } from '@shared/api/eperusteet';


export type SidenavKind =
  'root' | 'viite' | 'tiedot' | 'laajaalainenosaaminen2019';

export interface SidenavNode {
  key?: number; // Unique identifier
  label: string;
  type: SidenavKind;
  children: SidenavNode[];
  path: SidenavNode[]; // parent polku rootiin saakka, alkioiden määrä määrittää syvyyden
  location?: Location;
  isMatch?: boolean;
  isVisible?: boolean;
}

export interface FilteredSidenavNode extends SidenavNode {
  children: FilteredSidenavNode[];
  path: FilteredSidenavNode[]; // parent polku rootiin saakka, alkioiden määrä määrittää syvyyden
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
 */
export async function buildSidenav(peruste: PerusteDto): Promise<SidenavNode> {
  if (!peruste) {
    throw new Error('perustetta-ei-asetetu');
  }
  const koulutustyyppi: Koulutustyyppi | undefined = peruste.koulutustyyppi as Koulutustyyppi;
  const koulutustyyppiToteutus: KoulutustyyppiToteutus | undefined = (peruste.toteutus as any) as KoulutustyyppiToteutus;

  const tekstirakenne = traverseSisalto(await haeSisallys(peruste));

  // Rakenne perustepalvelun mukaisesta sisällöstä
  if (koulutustyyppi) {
    switch (koulutustyyppi) {
    case Koulutustyyppi.lisaopetus:
    case Koulutustyyppi.esiopetus:
    case Koulutustyyppi.varhaiskasvatus:
    case Koulutustyyppi.perusopetusvalmistava:
    case Koulutustyyppi.perusopetus:
    case Koulutustyyppi.aikuistenperusopetus:
    case Koulutustyyppi.lukiovalmistavakoulutus:
    case Koulutustyyppi.tpo:
      break;
    case Koulutustyyppi.lukiokoulutus:
    case Koulutustyyppi.aikuistenlukiokoulutus:
      if (koulutustyyppiToteutus && koulutustyyppiToteutus === KoulutustyyppiToteutus.lops2019) {
        break;
      }
      else {
        throw new Error('koulutustyyppin-sivunavigaatio-ei-toteutettu');
      }
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

  const rakenne = buildRoot(peruste, [
    buildTiedot(peruste),
    ...tekstirakenne,
  ]);
  setParents(rakenne, [rakenne]);
  return rakenne;
}

export function filterSidenav(node: SidenavNode, navfilter: SidenavFilter): FilteredSidenavNode {
  if (navfilter.isEnabled) {
    return {
      ...node,
      children: _(node.children)
        .map(child => filterSidenav(child, navfilter))
        .filter(child => child.isMatch || !_.isEmpty(child.children))
        .value() as unknown as FilteredSidenavNode[],
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
  for (const child of node.children) {
    setParents(child, [...path, child]);
  }
}

async function haeSisallys(peruste: PerusteDto): Promise<Matala> {
  const suoritustapakoodi = peruste!.suoritustavat
    ? peruste!.suoritustavat![0].suoritustapakoodi as any
    : 'LUKIOKOULUTUS2019';
  return (await Sisallot.getSuoritustapaSisaltoUUSI(peruste!.id!, suoritustapakoodi)).data;
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
        viiteId: '' + lapsi.id as any,
      },
    };
  }
}

function traverseSisalto(sisalto: Matala): SidenavNode[] {
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
