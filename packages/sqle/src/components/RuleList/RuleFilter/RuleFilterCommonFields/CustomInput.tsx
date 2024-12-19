import { useState } from 'react';
import { SearchOutlined } from '@actiontech/icons';
import { InputProps } from 'antd';
import { CustomInputStyleWrapper } from '@actiontech/shared/lib/components/CustomInput/style';

const CustomSearchInput: React.FC<
  {
    onChange?: (string?: string) => void;
  } & InputProps
> = ({ onChange, ...otherProps }) => {
  const [value, setValue] = useState<string>('');

  return (
    <CustomInputStyleWrapper
      size="small"
      className="custom-search-input"
      onPressEnter={(e) => {
        onChange?.(e.target.value);
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
