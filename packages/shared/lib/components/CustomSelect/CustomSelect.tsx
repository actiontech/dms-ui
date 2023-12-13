import { InputRef, SelectProps } from 'antd';
import { CustomSelectProps } from './index.type';
import { useTranslation } from 'react-i18next';
import { useMemo, useRef, useState } from 'react';
import CustomPlaceholder from './CustomPlaceholder';
import CustomOptionLabel from './CustomOptionLabel';
import { DefaultOptionType } from 'antd/es/select';
import {
  CustomSelectStyleWrapper,
  CustomSelectPopupMenuStyleWrapper
} from './style';
import classnames from 'classnames';
import CustomSelectSearchInput from './CustomSelectSearchInput';
import { useControllableValue } from 'ahooks';

const CustomSelect: React.FC<CustomSelectProps> = ({
  className,
  prefix,
  popupClassName,
  valuePrefix = prefix,
  onDropdownVisibleChange,
  searchValue,
  onSearch,
  isRenderLabel,
  ...props
}) => {
  const { t } = useTranslation();
  const searchInputRef = useRef<InputRef>(null);
  const [innerSearchValue, setInnerSearchValue] = useControllableValue<string>(
    typeof searchValue !== 'undefined' && onSearch
      ? {
          value: searchValue,
          onChange: onSearch
        }
      : { defaultValue: '' }
  );
  const [selectValue, setSelectValue] = useState<string | string[]>();

  const options = useMemo<SelectProps['options']>(() => {
    const calcOptions = (option: DefaultOptionType) => {
      const showLabel: string =
        typeof option.label === 'string'
          ? option.label
          : option.text ?? option.value;
      if (
        !showLabel.toLowerCase().includes(innerSearchValue?.toLowerCase() ?? '')
      ) {
        return null;
      }
      return {
        ...option,
        optionLabel: !!props.mode ? (
          showLabel
        ) : (
          <CustomOptionLabel
            prefix={valuePrefix}
            label={isRenderLabel ? option.label : showLabel}
          />
        )
      };
    };

    return props.options
      ?.map((v) => {
        if (v.options) {
          return {
            label: (
              <span className="custom-select-options-group-label">
                {v.label}
              </span>
            ),
            options: v.options
              .map(calcOptions)
              .filter((v: DefaultOptionType) => !!v)
          };
        } else {
          return calcOptions(v);
        }
      })
      .filter((v) => !!v) as SelectProps['options'];
  }, [props.mode, props.options, innerSearchValue, valuePrefix, isRenderLabel]);

  const renderDropdown: SelectProps['dropdownRender'] = (menu) => {
    const customMenu = (
      <>
        <CustomSelectSearchInput
          value={innerSearchValue}
          onChange={(val) => {
            setInnerSearchValue(val);
          }}
          ref={props.searchInputRef ?? searchInputRef}
        />
        <CustomSelectPopupMenuStyleWrapper>
          {menu}
        </CustomSelectPopupMenuStyleWrapper>
      </>
    );
    if (props.dropdownRender) {
      return props.dropdownRender(customMenu);
    }
    return customMenu;
  };

  const innerOnDropdownVisibleChange: SelectProps['onDropdownVisibleChange'] = (
    open
  ) => {
    onDropdownVisibleChange?.(open);
    if (open) {
      setTimeout(() => {
        (props.searchInputRef ?? searchInputRef).current?.focus();
      }, 200);
    } else {
      setInnerSearchValue('');
    }
  };

  const innerOnChange: SelectProps['onChange'] = (
    value: string | string[],
    defaultOptionType
  ) => {
    props.onChange?.(value, defaultOptionType);

    setSelectValue(value);
  };

  const tagRender: SelectProps['tagRender'] = ({ label, value }) => {
    const tokenSeparators = ', ';
    if (selectValue?.[0] === value) {
      return <CustomOptionLabel prefix={prefix} label={label} />;
    }

    return (
      <>
        {tokenSeparators} {label}
      </>
    );
  };

  return (
    <CustomSelectStyleWrapper
      size="small"
      className={classnames('custom-select-namespace', className)}
      allowClear
      popupMatchSelectWidth={false}
      dropdownRender={renderDropdown}
      {...props}
      onDropdownVisibleChange={innerOnDropdownVisibleChange}
      optionLabelProp="optionLabel"
      options={options}
      placeholder={
        <CustomPlaceholder
          prefix={prefix}
          placeholder={props.placeholder ?? t('common.form.placeholder.select')}
        />
      }
      popupClassName={classnames('custom-select-popup-wrapper', popupClassName)}
      dropdownStyle={{
        padding: 0
      }}
      showSearch={false}
      tagRender={tagRender}
      onChange={innerOnChange}
    />
  );
};

export default CustomSelect;
