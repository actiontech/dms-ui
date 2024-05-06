import { useRef } from 'react';
import { BasicDatePickerFieldStyleWrapper } from './style';
import type { DatePickerProps } from 'antd/es/date-picker';
import {
  IconDatePickerPrefix,
  IconDatePickerDown,
  IconDatePickerUp,
  IconDatePickerLeft,
  IconDatePickerRight
} from '../../Icon/common';
import { useBoolean } from 'ahooks';
import { DatePicker, ConfigProvider } from 'antd';
import classnames from 'classnames';
import { ComponentControlHeight } from '../../data/common';

export type IBasicDatePicker = DatePickerProps & { hideSuperIcon?: boolean };

const BasicDatePicker: React.FC<IBasicDatePicker> = ({
  className,
  onOpenChange,
  hideSuperIcon = true,
  ...otherProps
}) => {
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
        hideSuperIcon={hideSuperIcon}
        className={classnames('basic-date-picker-wrapper', className)}
      >
        <IconDatePickerPrefix className="prefix-icon" />
        <DatePicker
          {...otherProps}
          suffixIcon={!open ? <IconDatePickerDown /> : <IconDatePickerUp />}
          onOpenChange={(data: boolean) => {
            set(data);
            onOpenChange && onOpenChange(data);
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
