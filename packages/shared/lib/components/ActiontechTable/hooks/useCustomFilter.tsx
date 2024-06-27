import { useState } from 'react';
import dayjs from 'dayjs';
import { RangePickerProps } from 'antd/es/date-picker';
import { useTranslation } from 'react-i18next';
import {
  ActiontechTableFilterContainerMeta,
  FilterCustomProps,
  UpdateTableFilterInfoType
} from '../index.type';
import { CustomSelect, CustomSelectProps } from '../../CustomSelect';
import { CustomFilterRangePickerStyleWrapper } from '../components/style';
import CustomInput from '../../CustomInput';
import { SearchOutlined } from '@actiontech/icons';

const useCustomFilter = () => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState('');

  const generateInputFilter = <
    T extends Record<string, any>,
    F extends Record<string, any>
  >(
    meta: ActiontechTableFilterContainerMeta<T, F>[0],
    updateTableFilterInfo: UpdateTableFilterInfoType,
    filterCustomProps?: Map<keyof T, FilterCustomProps<'input'>>
  ) => {
    const props = filterCustomProps?.get(meta.dataIndex);
    const onPressEnter = (value: string) => {
      props?.onCustomPressEnter?.(value);
      if (typeof meta.filterKey === 'string') {
        const key = meta.filterKey;
        updateTableFilterInfo((filterInfo: F) => {
          return { ...filterInfo, [key]: value };
        });
      }
    };
    return (
      <CustomInput
        key={meta.dataIndex as string}
        {...props}
        onCustomPressEnter={onPressEnter}
        prefix={meta.filterLabel}
      />
    );
  };

  const generateSearchInputFilter = <
    T extends Record<string, any>,
    F extends Record<string, any>
  >(
    meta: ActiontechTableFilterContainerMeta<T, F>[0],
    updateTableFilterInfo: UpdateTableFilterInfoType,
    filterCustomProps?: Map<keyof T, FilterCustomProps<'search-input'>>
  ) => {
    const props = filterCustomProps?.get(meta.dataIndex);
    const onPressEnter = (value: string) => {
      props?.onCustomPressEnter?.(value);
      if (typeof meta.filterKey === 'string') {
        const key = meta.filterKey;
        updateTableFilterInfo((filterInfo: F) => {
          return { ...filterInfo, [key]: value };
        });
      }
    };

    return (
      <CustomInput
        key={meta.dataIndex as string}
        {...props}
        onCustomPressEnter={onPressEnter}
        className="filter-search-input"
        onChange={(e) => {
          setSearchValue(e.target.value);
        }}
        suffix={
          <SearchOutlined
            width={14}
            height={14}
            className="pointer"
            onClick={() => onPressEnter?.(searchValue)}
          />
        }
      />
    );
  };

  const generateSelectFilter = <
    T extends Record<string, any>,
    F extends Record<string, any>
  >(
    meta: ActiontechTableFilterContainerMeta<T, F>[0],
    updateTableFilterInfo: UpdateTableFilterInfoType,
    filterCustomProps?: Map<keyof T, FilterCustomProps<'select'>>
  ) => {
    const props = filterCustomProps?.get(meta.dataIndex);
    const onChange: CustomSelectProps['onChange'] = (value, option) => {
      props?.onChange?.(value, option);
      if (Array.isArray(meta.filterKey)) {
        updateTableFilterInfo((filterInfo: F) => {
          const targetFilterVal = (meta.filterKey as (keyof F)[]).reduce(
            (acc, cur) => ({ ...acc, [cur]: value }),
            {}
          );
          return {
            ...filterInfo,
            ...targetFilterVal
          };
        });
      } else if (typeof meta.filterKey === 'string') {
        const key = meta.filterKey;
        updateTableFilterInfo((filterInfo: F) => {
          return { ...filterInfo, [key]: value };
        });
      }
    };
    return (
      <CustomSelect
        key={meta.dataIndex as string}
        {...props}
        onChange={onChange}
        prefix={meta.filterLabel}
        suffixIcon={null}
        bordered={false}
      />
    );
  };

  const generateDataRangeFilter = <
    T extends Record<string, any>,
    F extends Record<string, any>
  >(
    meta: ActiontechTableFilterContainerMeta<T, F>[0],
    updateTableFilterInfo: UpdateTableFilterInfoType,
    filterCustomProps?: Map<keyof T, FilterCustomProps<'date-range'>>
  ) => {
    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
      return current && current > dayjs().endOf('day');
    };
    const props = filterCustomProps?.get(meta.dataIndex);
    const onChange: RangePickerProps['onChange'] = (values, formatString) => {
      props?.onChange?.(values, formatString);
      const formTime = values?.[0]?.format('YYYY-MM-DDTHH:mm:ssZ');
      const toTime = values?.[1]?.format('YYYY-MM-DDTHH:mm:ssZ');
      if (Array.isArray(meta.filterKey)) {
        if (meta.filterKey.length === 2) {
          const fromKey = meta.filterKey[0];
          const toKey = meta.filterKey[1];
          updateTableFilterInfo((filterInfo: F) => {
            return { ...filterInfo, [fromKey]: formTime, [toKey]: toTime };
          });
        }
      }
    };

    return (
      <CustomFilterRangePickerStyleWrapper
        key={meta.dataIndex as string}
        size="small"
        style={{
          minWidth: 320
        }}
        disabledDate={disabledDate}
        {...props}
        onChange={onChange}
        allowClear
        placeholder={[
          `${t(
            'common.actiontechTable.filterContainer.rangePickerPlaceholderStart'
          )}`,
          t('common.actiontechTable.filterContainer.rangePickerPlaceholderEnd')
        ]}
        prefix={
          <span className="custom-range-picker-filter-label">
            {meta.filterLabel}
          </span>
        }
      />
    );
  };

  return {
    generateSelectFilter,
    generateDataRangeFilter,
    generateInputFilter,
    generateSearchInputFilter
  };
};

export default useCustomFilter;
