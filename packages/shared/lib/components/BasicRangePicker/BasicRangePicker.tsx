import classnames from 'classnames';
import { BasicRangePickerStyleWrapper } from './style';
import { BasicDatePickerDropDownStyleWrapper } from '../BasicDatePicker/style';
import { CloseOutlined, RightOutlined, LeftOutlined } from '@actiontech/icons';
import { BasicRangePickerProps } from './BasicRangePicker.types';

const BasicRangePicker: React.FC<BasicRangePickerProps> = (props) => {
  const {
    className,
    suffixIcon,
    prefix,
    hideSuperIcon = true,
    ...otherParams
  } = props;

  return (
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
        clearIcon={<CloseOutlined fill="currentColor" />}
        separator={<RightOutlined width={14} height={14} fill="currentColor" />}
        getPopupContainer={(trigger) => {
          return trigger;
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
    </BasicDatePickerDropDownStyleWrapper>
  );
};

export default BasicRangePicker;
