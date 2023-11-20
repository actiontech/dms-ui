import { ConfigProvider } from 'antd5';
import { IconArrowRight, IconClose } from '../../Icon';
import { RangePickerProps } from 'antd5/es/date-picker';
import classnames from 'classnames';
import { ReactNode } from 'react';
import { BasicRangePickerStyleWrapper } from './style';
import { ComponentControlHeight } from '../../data/common';

export type BasicRangePickerProps = RangePickerProps & {
  prefix?: ReactNode;
};

const BasicRangePicker = (props: BasicRangePickerProps) => {
  const { className, suffixIcon, prefix, ...otherParams } = props;

  return (
    <ConfigProvider
      theme={{
        components: {
          DatePicker: {
            controlHeight: ComponentControlHeight.default,
            controlHeightLG: ComponentControlHeight.lg,
            controlHeightSM: ComponentControlHeight.sm
          }
        }
      }}
    >
      <BasicRangePickerStyleWrapper
        className={classnames('basic-range-picker-wrapper', className, {
          'custom-picker-prefix': !suffixIcon && !!prefix
        })}
        size="middle"
        {...otherParams}
        /**
         * when both suffixIcon and prefix exist, the former will force the latter to be overwritten
         */
        suffixIcon={suffixIcon ?? prefix}
        //todo allowClear={{clearIcon: <IconClose />}} need antd 5.8.0
        clearIcon={<IconClose />}
        separator={<IconArrowRight />}
      />
    </ConfigProvider>
  );
};

export default BasicRangePicker;
