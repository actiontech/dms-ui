import { useState } from 'react';
import { SearchOutlined } from '@actiontech/icons';
import { InputProps } from 'antd';
import { RuleFilterCustomInputStyleWrapper } from '../../style';

const CustomSearchInput: React.FC<
  {
    onChange?: (string?: string) => void;
  } & InputProps
> = ({ onChange, ...otherProps }) => {
  const [value, setValue] = useState<string>('');

  return (
    <RuleFilterCustomInputStyleWrapper
      size="small"
      className="custom-search-input"
      style={{ width: 210 }}
      onPressEnter={(e) => {
        onChange?.((e.target as HTMLInputElement).value);
      }}
      onChange={(e) => {
        setValue(e.target.value);
      }}
      suffix={
        <SearchOutlined
          className="pointer"
          onClick={() => onChange?.(value as string)}
        />
      }
      {...otherProps}
      value={value}
    />
  );
};

export default CustomSearchInput;
