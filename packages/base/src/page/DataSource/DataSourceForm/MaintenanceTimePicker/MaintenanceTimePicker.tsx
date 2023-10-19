import { useBoolean } from 'ahooks';
import { Col, message, Popover, Space, Typography } from 'antd5';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MaintenanceTimePickerProps, MaintenanceTimeValue } from '.';
import type { Dayjs } from 'dayjs';
import {
  BasicButton,
  BasicRangePicker,
  BasicTag,
  EmptyBox
} from '@actiontech/shared';
import { MaintenanceTimePickerPopoverWrapper } from './style';

const MaintenanceTimePicker: React.FC<MaintenanceTimePickerProps> = (props) => {
  const { value = [], onChange } = props;
  const [messageApi, contextHolder] = message.useMessage();
  const [
    popoverVisible,
    { toggle: popoverVisibleChange, setFalse: closePopover }
  ] = useBoolean();

  const { t } = useTranslation();

  const [range, setRange] = useState<[Dayjs | null, Dayjs | null] | null>();

  const turnMomentToMaintenanceTime = (
    startMoment: Dayjs,
    endMoment: Dayjs
  ): MaintenanceTimeValue => {
    return {
      startTime: {
        hour: startMoment.hour(),
        minute: startMoment.minute()
      },
      endTime: {
        hour: endMoment.hour(),
        minute: endMoment.minute()
      }
    };
  };

  const add = () => {
    if (range && range[0] && range[1]) {
      const newRange = turnMomentToMaintenanceTime(range[0], range[1]);
      if (
        value.some((v) => {
          return (
            v.startTime.hour === newRange.startTime.hour &&
            v.startTime.minute === newRange.startTime.minute &&
            v.endTime.hour === newRange.endTime.hour &&
            v.endTime.minute === newRange.endTime.minute
          );
        })
      ) {
        messageApi.info(t('common.maintenanceTimePicker.duplicate'));
      } else {
        onChange?.([...value, newRange]);
      }
    }
    closePopover();
    setRange(null);
  };

  const deleteTime = (index: number) => {
    onChange?.([...value.slice(0, index), ...value.slice(index + 1)]);
  };

  const addZero = (num: number) => {
    return num < 10 ? `0${num}` : num;
  };

  const generateKey = (time: MaintenanceTimeValue) => {
    return `${time.startTime.hour}${time.startTime.minute}${time.endTime.hour}${time.endTime.minute}`;
  };

  return (
    <Space className="full-width-element">
      {contextHolder}
      <EmptyBox
        if={value.length > 0}
        defaultNode={
          <Typography.Text type="secondary">
            {t('common.maintenanceTimePicker.placeholder')}
          </Typography.Text>
        }
      >
        {value.map((v, index) => (
          <BasicTag
            closable
            onClose={() => deleteTime(index)}
            key={`${generateKey(v)}-${index}`}
            size="large"
          >
            {addZero(v.startTime.hour)}:{addZero(v.startTime.minute)} -
            {addZero(v.endTime.hour)}:{addZero(v.endTime.minute)}
          </BasicTag>
        ))}
      </EmptyBox>
      <Popover
        open={popoverVisible}
        onOpenChange={popoverVisibleChange}
        content={
          <MaintenanceTimePickerPopoverWrapper>
            <Col
              span={6}
              className="maintenance-time-picker-label flex-all-center"
            >
              {t('common.maintenanceTimePicker.range')}
            </Col>
            <Col span={18}>
              <BasicRangePicker
                picker="time"
                format="HH:mm"
                value={range}
                onChange={setRange}
              />
            </Col>
            <Col span={24} className="maintenance-time-picker-btn-wrapper">
              <BasicButton size="small" type="primary" onClick={add}>
                {t('common.ok')}
              </BasicButton>
            </Col>
          </MaintenanceTimePickerPopoverWrapper>
        }
        trigger="click"
      >
        <BasicButton>{t('common.add')}</BasicButton>
      </Popover>
    </Space>
  );
};

export default MaintenanceTimePicker;
