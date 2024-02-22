export function formatParamsBySeparator(formatParams: string | number): string {
  if (Number.isNaN(formatParams)) {
    return 'NaN';
  }
  const val =
    typeof formatParams === 'number' ? formatParams + '' : formatParams;
  const result = [];
  let group = '';
  const [integerStr, floatStr] = val.split('.');
  for (let i = integerStr.length - 1; i >= 0; i--) {
    group = integerStr[i] + group;
    if ((integerStr.length - i) % 3 === 0 || i === 0) {
      result.unshift(group);
      group = '';
    }
  }
  return `${result.join(',')}${floatStr ? '.' + floatStr : ''}`;
}

export function fuzzySearchAndSortByWeight<T extends Record<string, any>>(
  query: string,
  data: Array<T>,
  key: keyof T
): Array<T> {
  if (!query) {
    return data;
  }
  const filterRegex = new RegExp(query, 'i');

  const results: Array<{ item: T } & { weight: number }> = [];

  data.forEach((item) => {
    const value = item[key];
    if (!value || typeof value !== 'string') {
      return item;
    }

    if (filterRegex.test(value)) {
      if (value.toLowerCase() === query.toLowerCase()) {
        results.unshift({ item, weight: 1000 });
      } else {
        const matchLen = query.length;
        const totalLen = value.length;
        const ratio = matchLen / totalLen;
        const weight = ratio * 1000;

        results.push({ item, weight });
      }
    }
  });

  return results.sort((a, b) => b.weight - a.weight).map((res) => res.item);
}
