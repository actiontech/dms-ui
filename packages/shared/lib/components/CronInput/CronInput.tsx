import { useTranslation } from 'react-i18next';
import { ReactNode, useEffect, useMemo } from 'react';
import { Col, Divider, Popover, Row } from 'antd';
import { ButtonType } from 'antd/es/button';
import { isEqual } from 'lodash';
import { CronInputComStyleWrapper, CronSelectStyleWrapper } from './style';
import { CronInputProps, CronWeekDayType } from './CronInput.types';
import useCron from './useCron';
import classNames from 'classnames';
import { CalendarOutlined } from '@actiontech/icons';
import { useControllableValue } from 'ahooks';
import { BasicButton } from '../BasicButton';
import { BasicInput } from '../BasicInput';
import {
  CronInputModeEnum,
  CronTimeUnitEnum,
  CronWeekDayEnum
} from './CronInput.enum';
import { weekDayKeys, weekDayValues } from './CronInput.data';

const CronInput: React.FC<CronInputProps> = (props: CronInputProps) => {
  const {
    value,
    error,
    week,
    minute,
    hour,
    updateCron,
    updateHour,
    updateMinute,
    updateWeek
  } = useCron({ defaultValue: props.value });

  const { t } = useTranslation();

  const [cronMode, setCronMode] = useControllableValue(
    typeof props.inputMode !== 'undefined'
      ? {
          value: props.inputMode,
          onChange: props.onModeChange,
          defaultValue: CronInputModeEnum.Manual
        }
      : {
          onChange: props.onModeChange,
          defaultValue: CronInputModeEnum.Manual
        }
  );

  const { isSelect, isManual } = useMemo(() => {
    return {
      isSelect: cronMode === CronInputModeEnum.Select,
      isManual: cronMode === CronInputModeEnum.Manual
    };
  }, [cronMode]);

  const currentButtonType: ButtonType = useMemo(() => {
    return isManual ? 'default' : 'primary'; // default primary
  }, [isManual]);

  const onChangeCronMode = () => {
    const modeVal = isManual
      ? CronInputModeEnum.Select
      : CronInputModeEnum.Manual;
    setCronMode(modeVal);
  };

  // week
  const weekData = useMemo(() => {
    return !week.length ? weekDayValues : week;
  }, [week]);
  const isEveryWeekDay = useMemo(() => {
    return isEqual(weekData, weekDayValues);
  }, [weekData]);

  const onChangeWeekDay = (val: string | number) => {
    if (typeof val === 'string') {
      if (val === 'all') {
        updateWeek(isEveryWeekDay ? [] : weekDayValues);
      }
      return;
    }
    if (isEveryWeekDay || week.includes(val as number)) {
      updateWeek(weekData.filter((item) => item !== val));
      return;
    }
    updateWeek(week.concat([val]));
  };

  const renderWeekItem = () => {
    return weekDayKeys.map((item: CronWeekDayType) => {
      const currentWeekVal = Number(CronWeekDayEnum[item]);
      return (
        <Col flex="auto" key={`btn-${item}`}>
          <BasicButton
            block
            disabled={props.disabled ?? false}
            type={weekData.includes(currentWeekVal) ? 'primary' : 'default'}
            onClick={() => onChangeWeekDay(currentWeekVal)}
          >
            {t(`common.cron.week.${item}`)}
          </BasicButton>
        </Col>
      );
    });
  };

  // hour & minute
  const { hourData, minuteData } = useMemo(() => {
    return {
      hourData: hour ?? [0],
      minuteData: minute ?? [0]
    };
  }, [hour, minute]);

  const onChangeHourOrMinute = (type: CronTimeUnitEnum, val: number) => {
    const typeData = type === CronTimeUnitEnum.Hour ? hourData : minuteData;
    const setMethod =
      type === CronTimeUnitEnum.Hour ? updateHour : updateMinute;
    if (typeData.includes(val)) {
      setMethod(typeData.filter((item) => item !== val));
      return;
    }
    setMethod(typeData.concat([val]));
  };

  const renderHourOrMinute = (type: CronTimeUnitEnum) => {
    const limitNumber = type === CronTimeUnitEnum.Hour ? 24 : 60;
    const typeData = type === CronTimeUnitEnum.Hour ? hourData : minuteData;
    const nodeData: ReactNode[] = [];
    for (let i = 0; i < limitNumber; i++) {
      nodeData.push(
        <BasicButton
          disabled={props.disabled ?? false}
          key={`type-${i}`}
          className="number-btn"
          type={typeData.includes(i) ? 'primary' : 'default'}
          onClick={() => onChangeHourOrMinute(type, i)}
        >
          {i}
        </BasicButton>
      );
    }
    return nodeData;
  };
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

  useEffect(() => {
    if (props.onError) {
      props.onError(error);
    }
  }, [error, props]);

  const hasError = useMemo(() => {
    return typeof error === 'string' && error.length;
  }, [error]);

  return (
    <CronInputComStyleWrapper>
      <BasicInput
        className="input-element"
        disabled={props.disabled ?? isSelect}
        placeholder={t('common.cron.placeholder')}
        onChange={(e) => updateCron(e.target.value)}
        value={value}
      />
      <Popover
        open={isSelect}
        overlayInnerStyle={{ padding: 0 }}
        placement="bottom"
        onOpenChange={(open) => {
          if (!open) {
            setCronMode(CronInputModeEnum.Manual);
          }
        }}
        trigger={['click']}
        arrow={false}
        content={
          <CronSelectStyleWrapper
            className={classNames({ 'error-style': hasError })}
          >
            <div className="header">
              {t('common.cron.subTitle.auditsFrequency')}
            </div>
            <Row gutter={16} className="week-wrapper">
              <Col flex="94px">
                <BasicButton
                  block
                  disabled={props.disabled ?? false}
                  onClick={() => onChangeWeekDay('all')}
                  type={isEveryWeekDay ? 'primary' : 'default'}
                >
                  {t('common.time.everyDay')}
                </BasicButton>
              </Col>
              {renderWeekItem()}
            </Row>
            <Divider style={{ margin: '20px 0' }} />
            <div className="header">{t('common.cron.subTitle.timerPoint')}</div>
            <section className="hour-minute-wrapper">
              <section className="hour-wrapper">
                <div className="sub-title">{t('common.time.hour')}</div>
                <div className="btn-wrapper">
                  {renderHourOrMinute(CronTimeUnitEnum.Hour)}
                </div>
              </section>
              <section className="minute-wrapper">
                <div className="sub-title">{t('common.time.minute')}</div>
                <div className="btn-wrapper">
                  {renderHourOrMinute(CronTimeUnitEnum.Minute)}
                </div>
              </section>
            </section>
          </CronSelectStyleWrapper>
        }
      >
        <BasicButton
          className="button-element"
          size="large"
          type={currentButtonType}
          disabled={props.disabled ?? false}
          icon={
            <CalendarOutlined
              className="custom-icon custom-icon-date"
              width={18}
              height={18}
              viewBox={`0 0 18 18`}
            />
          }
          onClick={onChangeCronMode}
        />
      </Popover>
    </CronInputComStyleWrapper>
  );
};

export default CronInput;
