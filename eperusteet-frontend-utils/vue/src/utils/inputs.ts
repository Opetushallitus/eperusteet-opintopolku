import _ from 'lodash';
const TextArea = document.createElement('textarea');

export function unescapeStringHtml(str: string | null) {
  if (!_.isString(str)) {
    return str;
  }

  if (!str) {
    return '';
  }
  else {
    TextArea.innerHTML = str;
    return TextArea.textContent;
  }
}
