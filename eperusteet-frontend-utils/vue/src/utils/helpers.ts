import * as _ from 'lodash';
import { findDeep, eachDeep } from 'deepdash-es/standalone';
import { Kielet } from '@shared/stores/kieli';

export function domAttrsGetter(...fields: string[]) {
  return (dom: any) => _.reduce(fields, (acc: any, field: string) => {
    return ({
      ...acc,
      [field]: dom.getAttribute(field),
    });
  }, {});
}

export function mapNodeAttrs(...fields: string[]) {
  return _.reduce(fields, (acc: any, field: string) => ({
    ...acc,
    [field]: {
      get() {
        return (this as any).node.attrs[field];
      },
      set(value: any) {
        (this as any).updateAttrs({
          [field]: value,
        });
      },
    },
  }), {});
}

export function deepFind(filterObject: Object | string, searchObject: any) : any {
  if (typeof filterObject === 'string') {
    return _.get(searchObject, filterObject);
  }

  return _.get(findDeep(searchObject, (value, key) => {
    if (_.keys(filterObject)[0] === key && _.values(filterObject)[0] === value) return true;
    return false;
  }), 'parent');
}

export function deepFilter(filterObject: Object | string, searchObject: any) : any {
  let objects : any[] = [];
  eachDeep(searchObject, object => {
    if (_.includes(_.keys(object), _.keys(filterObject)[0]) && _.get(object, _.keys(filterObject)[0]) === _.values(filterObject)[0]) {
      objects = [
        ...objects,
        object,
      ];
    }
  });
  return objects;
}

/**
 * fixataan vanhoja tekstikappaleita, joissa kuva on paragraphien sisällä <p><img/></p> ja uuden kälin editorissa kuvaa ei siksi näytetä
 */
export function fixTipTapContent(html) {
  let container = document.createElement('div');
  container.innerHTML = html;

  let el;
  // Move all images out of paragraphs.
  while ((el = container.querySelector('p > img'))) {
    unwrap(el.parentNode);
  }
  return container.innerHTML;
}

/**
 * Move all chldren out of an element, and remove the element.
 */
function unwrap(el) {
  let parent = el.parentNode;
  // Move all children to the parent element.
  while (el.firstChild) parent.insertBefore(el.firstChild, el);
  parent.removeChild(el);
}

export function flattenTree(item, childFunction) {
  return _.flatMap(_.get(item, childFunction), item => [item, ...flattenTree(item, childFunction)]);
};

export function nimiSearchIdentity(obj: any) {
  return _.toLower(Kielet.kaanna(obj.nimi));
}
