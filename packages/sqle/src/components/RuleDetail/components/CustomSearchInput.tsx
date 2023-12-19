import { ICustomInputProps } from '@actiontech/shared/lib/components/CustomInput';
import { RuleDetailCustomSearchInputStyleWrapper } from '../style';
import { IconSearch } from '@actiontech/shared/lib/Icon';
import { useState } from 'react';

const CustomSearchInput: React.FC<ICustomInputProps> = ({
  onCustomPressEnter,
  ...otherProps
}) => {
  const [value, setValue] = useState<string>('');
  return (
    <RuleDetailCustomSearchInputStyleWrapper
      className="custom-search-input"
      onCustomPressEnter={onCustomPressEnter}
      onChange={(e) => {
        setValue(e.target.value);
      }}
      suffix={
        <IconSearch
          className="pointer"
          onClick={() => onCustomPressEnter?.(value)}
        />
      }
      value={value}
      {...otherProps}
    />
  );
};

export default CustomSearchInput;
