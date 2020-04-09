export function highlight(nimi, query: string) {
  if (!query) {
    return nimi;
  }

  return (nimi || '').replace(new RegExp(query, 'ig'), (match) => '<mark>' + match + '</mark>');
}
