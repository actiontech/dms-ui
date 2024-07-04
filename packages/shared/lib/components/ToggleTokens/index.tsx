import classNames from 'classnames';
import { ToggleTokensProps } from './index.type';
import { ToggleTokensStyleWrapper } from './style';
import BasicButton from '../BasicButton';
import { useControllableValue } from 'ahooks';
import EmptyBox from '../EmptyBox';
import { IconCheckoutCircle } from '../../Icon/common';
import { useMemo } from 'react';

const ToggleTokens = <V extends string | number | null = string>({
  className,
  options,
  value,
  onChange,
  multiple,
  withCheckbox,
  noStyle,
  labelDictionary,
  defaultValue,
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
          onChange,
          defaultValue
        }
      : {
          onChange,
          defaultValue
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

  const transformOptions = useMemo(() => {
    return options.map((item) => {
      if (labelDictionary) {
        if (typeof item === 'string') {
          return {
            label: labelDictionary[item] ?? item,
            value: item
          };
        }

        return {
          label:
            typeof item.label === 'string'
              ? labelDictionary[item.label] ?? item.label
              : item.label,
          value: item.value,
          className: item.className
        };
      }

      if (typeof item === 'string') {
        return {
          label: item,
          value: item
        };
      }

      return {
        label: item.label,
        value: item.value,
        className: item.className
      };
    });
  }, [labelDictionary, options]);

  return (
    <ToggleTokensStyleWrapper
      className={classNames(className, 'actiontech-toggle-tokens')}
      {...props}
    >
      {transformOptions.map((item) => {
        const label = item.label;
        const itemValue = item.value;

        let checked = false;

        if (multiple) {
          const values = (internalValue as V[]) ?? [];
          checked = !!values?.includes(itemValue as V);
        } else {
          checked = internalValue === itemValue;
        }

        const commonCls = classNames('toggle-token-item', {
          'toggle-token-item-with-checkbox': withCheckbox,
          'toggle-token-item-checked': checked
        });

        const renderTokenWithButtonStyle = () => {
          return (
            <BasicButton
              className={classNames(
                commonCls,
                'toggle-token-item-button-style'
              )}
              type={checked ? 'primary' : undefined}
              onClick={() => {
                handleClick(itemValue as V);
              }}
            >
              {renderChildren()}
            </BasicButton>
          );
        };

        const renderTokenWithNoStyle = () => {
          return (
            <div
              className={classNames(commonCls, 'toggle-token-item-no-style')}
              onClick={() => {
                handleClick(itemValue as V);
              }}
            >
              {renderChildren()}
            </div>
          );
        };

        const renderChildren = () => {
          const labelCls = classNames('toggle-token-item-label');
          if (withCheckbox && checked) {
            return (
              <div className="toggle-token-item-with-checkbox-children">
                <IconCheckoutCircle />
                <span className={labelCls}>{label}</span>
              </div>
            );
          }
          return <span className={labelCls}>{label}</span>;
        };

        return (
          <EmptyBox
            key={itemValue as string}
            if={!noStyle}
            defaultNode={renderTokenWithNoStyle()}
          >
            {renderTokenWithButtonStyle()}
          </EmptyBox>
        );
      })}
    </ToggleTokensStyleWrapper>
  );
};

export default ToggleTokens;
