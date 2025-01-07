import classnames from 'classnames';
import {
  CustomSegmentedFilterBaseValue,
  CustomSegmentedFilterDefaultOptionsType,
  CustomSegmentedFilterProps
} from './CustomSegmentedFilter.types';
import { useControllableValue } from 'ahooks';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SegmentedProps } from 'antd';
import { BasicSegmented } from '../BasicSegmented';
import { SegmentedValue } from 'antd/es/segmented';

const CustomSegmentedFilter = <
  V extends CustomSegmentedFilterBaseValue = string
>(
  props: CustomSegmentedFilterProps<V>
) => {
  const { t } = useTranslation();

  const { labelDictionary, withAll, noStyle, className, style, options } =
    props;

  const [value, onChange] = useControllableValue<V>(
    typeof props.value !== 'undefined'
      ? {
          value: props.value,
          onChange: props.onChange,
          defaultValue: props.defaultValue
        }
      : {
          onChange: props.onChange,
          defaultValue: props.defaultValue
        }
  );

  const mergeOptions = useMemo<
    CustomSegmentedFilterDefaultOptionsType<V>
  >(() => {
    const transformOptions: CustomSegmentedFilterDefaultOptionsType<V> =
      options.map((item) => {
        if (labelDictionary) {
          if (typeof item === 'string') {
            return {
              label: labelDictionary[item] ?? item,
              value: item as V
            };
          }

          return {
            label:
              typeof item.label === 'string'
                ? labelDictionary[item.label] ?? item.label
                : item.label,
            value: item.value as V
          };
        } else {
          if (typeof item === 'string') {
            return {
              label: item,
              value: item as V
            };
          }

          return {
            label: item.label,
            value: item.value
          };
        }
      });

    if (!withAll) {
      return transformOptions;
    }

    if (withAll === true) {
      return [
        {
          label: t('common.all'),
          value: null as V
        },
        ...transformOptions
      ];
    }

    return [withAll, ...transformOptions];
  }, [labelDictionary, options, t, withAll]);

  const mergeClassNames = classnames(
    'custom-segmented-filter-wrapper',
    className
  );

  const render = () => {
    if (noStyle) {
      return (
        <div style={style} className={mergeClassNames}>
          {mergeOptions.map((item) => {
            return (
              <div
                key={item.value}
                className={classnames('custom-segmented-filter-item', {
                  'custom-segmented-filter-item-checked': value === item.value
                })}
                onClick={() => {
                  onChange(item.value);
                }}
              >
                {item.label}
              </div>
            );
          })}
        </div>
      );
    }
    return (
      <BasicSegmented
        className={mergeClassNames}
        value={value as SegmentedValue}
        defaultValue={props.defaultValue as SegmentedValue}
        onChange={(val) => {
          onChange(val as V);
        }}
        options={mergeOptions as SegmentedProps['options']}
      />
    );
  };

  return render();
};

export default CustomSegmentedFilter;
