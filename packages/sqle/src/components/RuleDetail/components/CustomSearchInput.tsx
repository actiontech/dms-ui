import { ICustomInputProps } from '@actiontech/shared/lib/components/CustomInput';
import { RuleDetailCustomSearchInputStyleWrapper } from '../style';
import { useState, useEffect } from 'react';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import { SearchOutlined } from '@actiontech/icons';

const CustomSearchInput: React.FC<ICustomInputProps> = ({
  onCustomPressEnter,
  ...otherProps
}) => {
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    const { unsubscribe } = EventEmitter.subscribe(
      EmitterKey.Search_Rule_Template_Rule_Clear_Value,
      () => {
        setValue('');
        EventEmitter.emit(EmitterKey.Search_Rule_Template_Rule_Select_List, '');
      }
    );

    return unsubscribe;
  }, []);

  return (
    <RuleDetailCustomSearchInputStyleWrapper
      size="small"
      className="custom-search-input"
      onPressEnter={(e) => {
        onCustomPressEnter(e.target.value ?? '');
      }}
      onChange={(e) => {
        setValue(e.target.value);
      }}
      suffix={
        <SearchOutlined
          className="pointer"
          onClick={() => onCustomPressEnter?.(value as string)}
        />
      }
      value={value}
      {...otherProps}
    />
  );
};

export default CustomSearchInput;
