import { InputRef, SelectProps } from 'antd5';
import { CustomSelectProps } from './index.type';
import { useTranslation } from 'react-i18next';
import { useMemo, useRef, useState } from 'react';
import { Box } from '@mui/system';
import CustomPlaceholder from './CustomPlaceholder';
import CustomOptionLabel from './CustomOptionLabel';
import { DefaultOptionType } from 'antd5/es/select';
import {
  CustomSelectStyleWrapper,
  CustomSelectSearchInputStyleWrapper,
  CustomSelectPopupMenuStyleWrapper
} from './style';
import classnames from 'classnames';

const CustomSelect: React.FC<CustomSelectProps> = ({
  className,
  prefix,
  popupClassName,
  valuePrefix = prefix,
  onDropdownVisibleChange,
  ...props
}) => {
  const { t } = useTranslation();
  const searchInputRef = useRef<InputRef>(null);
  const [searchValue, setSearchValue] = useState('');
  const [selectValue, setSelectValue] = useState<string | string[]>();

  const options = useMemo<SelectProps['options']>(() => {
    const calcOptions = (option: DefaultOptionType) => {
      const showLabel: string =
        typeof option.label === 'string'
          ? option.label
          : option.text ?? option.value;

      if (!showLabel.toLowerCase().includes(searchValue.toLowerCase())) {
        return null;
      }
      return {
        ...option,
        optionLabel: !!props.mode ? (
          showLabel
        ) : (
          <CustomOptionLabel prefix={valuePrefix} label={showLabel} />
        )
      };
    };

    return props.options
      ?.map((v) => {
        if (v.options) {
          return {
            label: (
              <Box
                sx={{
                  color: (theme) => theme.sharedTheme.uiToken.colorPrimary
                }}
              >
                <span>{v.label}</span>
              </Box>
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
  }, [props.mode, props.options, searchValue, valuePrefix]);

  const renderDropdown: SelectProps['dropdownRender'] = (menu) => {
    const customMenu = (
      <>
        <CustomSelectSearchInputStyleWrapper
          size="large"
          ref={searchInputRef}
          className="custom-select-popup-search-input"
          bordered={false}
          placeholder={t('common.search')}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          allowClear
        />
        {props.dropdownSlot}
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
        searchInputRef.current?.focus();
      }, 200);
    } else {
      setSearchValue('');
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
      {...props}
      dropdownRender={renderDropdown}
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
