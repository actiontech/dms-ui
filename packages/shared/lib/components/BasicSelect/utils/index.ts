import { extractTextFromReactNode } from '../../ActiontechTable/utils';
import { SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';

export const filterOptionByLabel: SelectProps['filterOption'] = (
  input: string,
  option?: DefaultOptionType
) => {
  const label = extractTextFromReactNode(
    option?.label ??
      (typeof option?.children === 'string' ? option?.children : '')
  );
  return label.toLowerCase().includes(input.toLowerCase());
};
