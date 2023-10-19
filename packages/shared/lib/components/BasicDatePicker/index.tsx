import { useRef } from 'react';
import { BasicDatePickerFieldStyleWrapper } from './style';
import type { DatePickerProps } from 'antd5/es/date-picker';
import {
  IconDatePickerPrefix,
  IconDatePickerDown,
  IconDatePickerUp,
  IconDatePickerLeft,
  IconDatePickerRight
} from '../../Icon/common';
import { useBoolean } from 'ahooks';
import { DatePicker, ConfigProvider } from 'antd5';
import classnames from 'classnames';
import { ComponentControlHeight } from '../../data/common';

const BasicDatePicker: React.FC<
  DatePickerProps & { hideSuperIcon?: boolean }
> = ({ className, onOpenChange, hideSuperIcon = true, ...otherProps }) => {
  const [open, { set }] = useBoolean();

  const ref = useRef<HTMLDivElement | null>(null);

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
      <BasicDatePickerFieldStyleWrapper
        ref={ref}
        className={classnames('basic-date-picker-wrapper', className, {
          'basic-date-picker-hide-super-icon': hideSuperIcon
        })}
      >
        <IconDatePickerPrefix className="prefix-icon" />
        <DatePicker
          {...otherProps}
          suffixIcon={!open ? <IconDatePickerDown /> : <IconDatePickerUp />}
          onOpenChange={(open: boolean) => {
            set(open);
            onOpenChange && onOpenChange(open);
          }}
          getPopupContainer={() => {
            return ref.current!;
          }}
          nextIcon={<IconDatePickerRight className="next-icon" />}
          prevIcon={<IconDatePickerLeft className="prev-icon" />}
        />
      </BasicDatePickerFieldStyleWrapper>
    </ConfigProvider>
  );
};

export default BasicDatePicker;
