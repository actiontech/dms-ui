import { ConfigProvider } from 'antd';
import { IconArrowRight, IconClose } from '../../Icon';
import { RangePickerProps } from 'antd/es/date-picker';
import classnames from 'classnames';
import { ReactNode } from 'react';
import { BasicRangePickerStyleWrapper } from './style';
import { ComponentControlHeight } from '../../data/common';
import { IconDatePickerLeft, IconDatePickerRight } from '../../Icon/common';
import { BasicDatePickerDropDownStyleWrapper } from '../BasicDatePicker/style';

export type BasicRangePickerProps = RangePickerProps & {
  prefix?: ReactNode;
  hideSuperIcon?: boolean;
};

const BasicRangePicker = (props: BasicRangePickerProps) => {
  const {
    className,
    suffixIcon,
    prefix,
    hideSuperIcon = true,
    ...otherParams
  } = props;

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
      <BasicDatePickerDropDownStyleWrapper hideSuperIcon={hideSuperIcon}>
        <BasicRangePickerStyleWrapper
          className={classnames('basic-range-picker-wrapper', className, {
            'custom-picker-prefix': !suffixIcon && !!prefix
          })}
          {...otherParams}
          /**
           * when both suffixIcon and prefix exist, the former will force the latter to be overwritten
           */
          suffixIcon={suffixIcon ?? prefix}
          //todo allowClear={{clearIcon: <IconClose />}} need antd 5.8.0
          clearIcon={<IconClose />}
          separator={<IconArrowRight />}
          getPopupContainer={(trigger) => {
            return trigger;
          }}
          nextIcon={<IconDatePickerRight className="next-icon" />}
          prevIcon={<IconDatePickerLeft className="prev-icon" />}
        />
      </BasicDatePickerDropDownStyleWrapper>
    </ConfigProvider>
  );
};

export default BasicRangePicker;
