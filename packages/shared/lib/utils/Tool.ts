export function formatParamsBySeparator(formatParams: string | number) {
  const val = (
    typeof formatParams === 'number' && !Number.isNaN(formatParams)
      ? formatParams + ''
      : formatParams
  ) as string;
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
