import { useTranslation } from 'react-i18next';
import { ReactNode, useEffect, useMemo, useState } from 'react';

import { Col, Divider, Row } from 'antd';
import BasicInput from '../../BasicInput';
import BasicButton from '../../BasicButton';
import { IconDate } from '../../../Icon/common';
import { ButtonType } from 'antd/es/button';

import { isEqual } from 'lodash';
import {
  enumWeek,
  weekKeys,
  weekValues,
  typeWeekday,
  enumHourMinute,
  typeHourMinute
} from './index.type';
import { CronSelectStyleWrapper } from './style';

import { CronInputProps, CronMode, typeCronMode } from '../index.type';
import useCron from '../useCron';
import classNames from 'classnames';

const CronInputCom = (props: CronInputProps) => {
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

  const [cronMode, setCronMode] = useState<typeCronMode>(CronMode.Manual);
  const { isSelect, isManual } = useMemo(() => {
    if (props.mode !== undefined) {
      return {
        isSelect: props.mode === CronMode.Select,
        isManual: props.mode === CronMode.Manual
      };
    }
    return {
      isSelect: cronMode === CronMode.Select,
      isManual: cronMode === CronMode.Manual
    };
  }, [cronMode, props.mode]);

  const currentButtonType: ButtonType = useMemo(() => {
    return isManual ? 'default' : 'primary'; // default primary
  }, [isManual]);

  const updateCronMode = (mode: CronMode) => {
    if (props.mode !== undefined) {
      props.modeChange?.(mode);
    } else {
      setCronMode(mode);
    }
  };

  const onChangeCronMode = () => {
    const modeVal = isManual ? CronMode.Select : CronMode.Manual;
    updateCronMode(modeVal);
  };

  // week
  const weekData = useMemo(() => {
    return !week.length ? weekValues : week;
  }, [week]);
  const isEveryWeekDay = useMemo(() => {
    return isEqual(weekData, weekValues);
  }, [weekData]);

  const onChangeWeekDay = (val: string | number) => {
    if (typeof val === 'string') {
      val === 'all' && updateWeek(isEveryWeekDay ? [] : weekValues);
      return;
    }
    if (isEveryWeekDay || week.includes(val as number)) {
      updateWeek(weekData.filter((item) => item !== val));
      return;
    }
    updateWeek(week.concat([val]));
  };

  const renderWeekItem = () => {
    return weekKeys.map((item: typeWeekday) => {
      const currentWeekVal = Number(enumWeek[item]);
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

  const onChangeHourOrMinute = (type: typeHourMinute, val: number) => {
    const typeData = type === enumHourMinute.hour ? hourData : minuteData;
    const setMethod = type === enumHourMinute.hour ? updateHour : updateMinute;
    if (typeData.includes(val)) {
      setMethod(typeData.filter((item) => item !== val));
      return;
    }
    setMethod(typeData.concat([val]));
  };

  const renderHourOrMinute = (type: typeHourMinute) => {
    const limitNumber = type === enumHourMinute.hour ? 24 : 60;
    const typeData = type === enumHourMinute.hour ? hourData : minuteData;
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
    if (props.updateErrorMessage) {
      props.updateErrorMessage(error);
    }
  }, [error, props]);

  const hasError = useMemo(() => {
    return typeof error === 'string' && error.length;
  }, [error]);

  return (
    <>
      <Row gutter={8}>
        <Col flex="auto">
          <BasicInput
            disabled={props.disabled ?? isSelect}
            placeholder={t('common.cron.placeholder')}
            style={{ textAlign: 'center' }}
            onChange={(e) => updateCron(e.target.value)}
            value={value}
          ></BasicInput>
        </Col>
        <Col flex="36px">
          <BasicButton
            size="large"
            type={currentButtonType}
            disabled={props.disabled ?? false}
            icon={<IconDate />}
            onClick={onChangeCronMode}
          ></BasicButton>
        </Col>
      </Row>
      <CronSelectStyleWrapper
        hidden={isManual}
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
              {renderHourOrMinute(enumHourMinute.hour)}
            </div>
          </section>
          <section className="minute-wrapper">
            <div className="sub-title">{t('common.time.minute')}</div>
            <div className="btn-wrapper">
              {renderHourOrMinute(enumHourMinute.minute)}
            </div>
          </section>
        </section>
      </CronSelectStyleWrapper>
    </>
  );
};

export default CronInputCom;
