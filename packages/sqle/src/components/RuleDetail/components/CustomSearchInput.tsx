import { ICustomInputProps } from '@actiontech/shared/lib/components/CustomInput';
import { RuleDetailCustomSearchInputStyleWrapper } from '../style';
import { IconSearch } from '@actiontech/shared/lib/Icon';
import { useState, useEffect } from 'react';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';

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
        <IconSearch
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
