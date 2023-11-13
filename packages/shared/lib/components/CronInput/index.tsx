import {
  Select,
  Input,
  Radio,
  RadioChangeEvent,
  Space,
  TimePicker,
  Typography
} from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cronOptions } from './index.data';
import './index.less';
import { CronInputProps, CronMode } from './index.type';
import useCron from './useCron';
import dayjs, { Dayjs } from 'dayjs';

const CronInput: React.FC<CronInputProps> = (props) => {
  const {
    value,
    error,
    week,
    minute,
    hour,
    updateCron,
    updateTime,
    updateWeek
  } = useCron({ defaultValue: props.value });

  const { t } = useTranslation();
  const [cronMode, setCronMode] = useState<CronMode>(CronMode.Select);
  const mode = useMemo<CronMode>(() => {
    if (props.mode !== undefined) {
      return props.mode;
    }
    return cronMode;
  }, [props.mode, cronMode]);

  const updateCronMode = (mode: CronMode) => {
    if (props.mode !== undefined) {
      props.modeChange?.(mode);
    } else {
      setCronMode(mode);
    }
  };

  const handleCronModeChange = (e: RadioChangeEvent) => {
    const tempMode = e.target.value;
    updateCronMode(tempMode);
  };

  const handleWeekChange = (nextEvery: number) => {
    if (nextEvery === -1) {
      updateWeek([]);
      return;
    }
    updateWeek([nextEvery]);
  };

  const time = useMemo(() => {
    return dayjs(`${hour ?? 0}:${minute ?? 0}`, 'HH:mm');
  }, [hour, minute]);

  const handleTimeChange = (time: Dayjs | null) => {
    const hour = time?.hour() ?? 0;
    const minute = time?.minute() ?? 0;
    updateTime(hour, minute);
  };

  useEffect(() => {
    if (props.updateErrorMessage) {
      props.updateErrorMessage(error);
    }
  }, [error, props]);

  useEffect(() => {
    if (!!props.value && props.value !== value) {
      updateCron(props.value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.value]);

  useEffect(() => {
    if (props.onChange) {
      props.onChange(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const simpleEnable = useMemo(() => {
    const [minute, hour, _day, _month, week] = value.split(' ');
    return (
      !isNaN(Number(minute)) &&
      !isNaN(Number(hour)) &&
      _day === '*' &&
      _month === '*' &&
      (week === '*' || !isNaN(Number(minute)))
    );
  }, [value]);

  useEffect(() => {
    if (!error && !simpleEnable && value && mode === CronMode.Select) {
      updateCronMode(CronMode.Manual);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, simpleEnable, value]);

  return (
    <div className="cron-input-wrapper">
      <div style={{ lineHeight: '32px' }}>
        <Radio.Group value={cronMode} onChange={handleCronModeChange}>
          <Radio disabled={!simpleEnable} value={CronMode.Select}>
            {t('common.cron.mode.select')}
          </Radio>
          <Radio value={CronMode.Manual}>{t('common.cron.mode.manual')}</Radio>
        </Radio.Group>
      </div>
      <div className="cron-user-select" hidden={mode === CronMode.Manual}>
        <Space>
          <Select
            className="cron-every-select"
            onChange={handleWeekChange}
            value={week[0] ?? -1}
            options={cronOptions}
          />
          <TimePicker
            format="HH:mm"
            allowClear={false}
            value={time}
            onChange={handleTimeChange}
          />
          <div data-testid="cron-preview">
            <Typography.Text type="secondary">
              {t('common.preview')}: {value}
            </Typography.Text>
          </div>
        </Space>
      </div>
      <div className="cron-user-manual" hidden={mode === CronMode.Select}>
        <Input onChange={(e) => updateCron(e.target.value)} value={value} />
      </div>
    </div>
  );
};

export default CronInput;
