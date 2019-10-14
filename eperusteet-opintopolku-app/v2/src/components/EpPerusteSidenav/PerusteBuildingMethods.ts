import _ from 'lodash';
import { Matala } from "@shared/api/tyypit";

export function sisaltoLinkit(sisalto: Matala) {
  const children: object[] = [];

  if (!_.isEmpty(sisalto.lapset)) {
    _.each(sisalto.lapset, (lapsi: Matala) => {
      children.push({
        id: lapsi.id,
        perusteenOsa: lapsi.perusteenOsa,
        tyyppi: 'viite',
        ...sisaltoLinkit(lapsi)
      });
    })
  }

  return {
    children
  }
}

export function yksinkertainenLinkit(perusteId: number, sisalto: Matala) {
  const sisallot = sisaltoLinkit(sisalto);
  sisallot.children.unshift({
    tyyppi: 'tiedot',
    perusteId,
  });
  return sisallot;
}
