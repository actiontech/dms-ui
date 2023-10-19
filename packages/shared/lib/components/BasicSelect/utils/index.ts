import { extractTextFromReactNode } from '../../ActiontechTable/utils';
import { SelectProps } from 'antd5';
import { DefaultOptionType } from 'antd5/es/select';

export const filterOptionByLabel: SelectProps['filterOption'] = (
  input: string,
  option?: DefaultOptionType
) => {
  const label = extractTextFromReactNode(option?.label);
  return label.toLowerCase().includes(input.toLowerCase());
};
