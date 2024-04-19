import classNames from 'classnames';
import { ToggleTokensProps } from './index.type';
import { ToggleTokensStyleWrapper } from './style';
import BasicButton from '../BasicButton';
import { useControllableValue } from 'ahooks';
import { Checkbox } from 'antd';
import EmptyBox from '../EmptyBox';

const ToggleTokens = <V extends string | number | null = string>({
  className,
  options,
  value,
  onChange,
  multiple,
  withCheckbox,
  ...props
}: ToggleTokensProps<V>) => {
  // #if [DEV]
  if (multiple && typeof value !== 'undefined' && !Array.isArray(value)) {
    throw new Error(
      'Error: Failed prop type: Invalid prop `value` of type `string` supplied to `ToggleTokens`, expected `array`.'
    );
  }
  // #endif

  const [internalValue, setInternalValue] = useControllableValue<V | V[]>(
    typeof value !== 'undefined' && onChange
      ? {
          value,
          onChange
        }
      : {
          onChange
        }
  );

  const handleClick = (checkedValue: V) => {
    if (multiple) {
      setInternalValue((innerValue) => {
        const values = (innerValue as V[]) ?? [];
        if (values.includes(checkedValue)) {
          return values.filter((item) => item !== checkedValue);
        } else {
          return [...values, checkedValue];
        }
      });
    } else {
      setInternalValue(checkedValue);
    }
  };

  return (
    <ToggleTokensStyleWrapper
      className={classNames(className, 'actiontech-toggle-tokens')}
      {...props}
    >
      {options.map((item) => {
        const label = typeof item === 'string' ? item : item.label;
        const itemValue = typeof item === 'string' ? item : item.value;

        let checked = false;

        if (multiple) {
          const values = (internalValue as V[]) ?? [];
          checked = !!values?.includes(itemValue as V);
        } else {
          checked = internalValue === itemValue;
        }

        return (
          <BasicButton
            className={classNames('toggle-token-item', {
              'toggle-token-item-with-checkbox': withCheckbox,
              'toggle-token-item-checked': checked
            })}
            type={checked ? 'primary' : undefined}
            key={itemValue as string}
            onClick={() => {
              handleClick(itemValue as V);
            }}
          >
            <EmptyBox if={withCheckbox}>
              <Checkbox checked={checked} />
            </EmptyBox>
            <span>{label}</span>
          </BasicButton>
        );
      })}
    </ToggleTokensStyleWrapper>
  );
};

export default ToggleTokens;
