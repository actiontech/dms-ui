import { useRef } from 'react';
import { BasicDatePickerFieldStyleWrapper } from './style';
import { useBoolean } from 'ahooks';
import { DatePicker } from 'antd';
import classnames from 'classnames';
import {
  UpOutlined,
  ClockCircleFilled,
  DownOutlined,
  RightOutlined,
  LeftOutlined
} from '@actiontech/icons';
import { BasicDatePickerProps } from './BasicDatePicker.types';

const BasicDatePicker: React.FC<BasicDatePickerProps> = ({
  className,
  onOpenChange,
  hideSuperIcon = true,
  ...otherProps
}) => {
  const [open, { set }] = useBoolean();

  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <BasicDatePickerFieldStyleWrapper
      ref={ref}
      hideSuperIcon={hideSuperIcon}
      className={classnames('basic-date-picker-wrapper', className)}
    >
      <ClockCircleFilled
        fill="currentColor"
        width={18}
        height={18}
        className="prefix-icon"
      />
      <DatePicker
        {...otherProps}
        suffixIcon={!open ? <DownOutlined /> : <UpOutlined />}
        onOpenChange={(data: boolean) => {
          set(data);
          onOpenChange?.(data);
        }}
        getPopupContainer={() => {
          return ref.current!;
        }}
        nextIcon={
          <span className="next-icon">
            <RightOutlined width={14} height={14} />
          </span>
        }
        prevIcon={
          <span className="prev-icon">
            <LeftOutlined width={14} height={14} />
          </span>
        }
      />
    </BasicDatePickerFieldStyleWrapper>
  );
};

export default BasicDatePicker;
