import _ from 'lodash';
import { Matala } from "@shared/api/tyypit";

export interface SidenavNode {
  id?: number,
  type: 'viite' | 'tiedot'
  perusteenOsa?: object,
  tiedot?: object,
  children?: Array<SidenavNode>
}


export function sisaltoLinkit(sisalto: Matala) {
  const children: Array<SidenavNode> = [];

  if (!_.isEmpty(sisalto.lapset)) {
    _.each(sisalto.lapset, (lapsi: Matala) => {
      children.push({
        id: lapsi.id!,
        perusteenOsa: lapsi.perusteenOsa,
        type: 'viite',
        ...sisaltoLinkit(lapsi)
      });
    })
  }

  if (!_.isEmpty(children)) {
    return {
      children
    }
  }
  else {
    return {
    }
  }
}

export function yksinkertainenLinkit(perusteId: number, sisalto: Matala) {
  const treeData = sisaltoLinkit(sisalto);
  if (treeData.children) {
    treeData.children.unshift({
      type: 'tiedot',
      tiedot: {
        perusteId
      },
    });
  }
  return treeData;
}
