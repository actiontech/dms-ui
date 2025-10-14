import { timeAddZero } from '@actiontech/dms-kit';
import { useBoolean } from 'ahooks';
import { Form } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { range } from 'lodash';
import { useTranslation } from 'react-i18next';
import {
  BasicButton,
  BasicModal,
  BasicTag,
  EmptyBox
} from '@actiontech/dms-kit';
import { ToggleTokensOptionsType } from '@actiontech/dms-kit';
import { ScheduleTimeFormFields, ScheduleTimeModalProps } from './index.type';
import { FormItemNoLabelStyleWrapper } from '@actiontech/dms-kit/es/components/CustomForm/FormItem/style';
import dayjs, { Dayjs } from 'dayjs';
import { BasicDatePicker } from '@actiontech/dms-kit';
import ConfirmationSettingForm from './components/ConfirmationSettingForm';
import { useEffect, useState } from 'react';
import { FormStyleWrapper } from '@actiontech/dms-kit/es/components/CustomForm/style';
import { ScheduleTimeModelDescribeStyleWrapper } from './style';
import { checkTimeInWithMaintenanceTime } from '../../../../../Common/utils';
const ScheduleTimeModal: React.FC<ScheduleTimeModalProps> = ({
  open,
  closeScheduleModal,
  maintenanceTime = [],
  submit
}) => {
  const { t } = useTranslation();
  const [form] = useForm<ScheduleTimeFormFields>();
  const [
    scheduleLoading,
    { setTrue: scheduleStart, setFalse: scheduleFinish }
  ] = useBoolean();

  // #if [ee]
  const enableNotificationConfirm = Form.useWatch(
    'notification_confirmation',
    form
  );
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const [confirmTypeTokens, setConfirmTypeTokens] =
    useState<ToggleTokensOptionsType>([]);
  useEffect(() => {
    form.setFieldValue('confirmation_method', undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enableNotificationConfirm]);
  // #endif

  const resetAndCloseScheduleModal = () => {
    // #if [ee]
    setConfirmTypeTokens([]);
    setSubmitButtonDisabled(false);
    // #endif
    form.resetFields();
    closeScheduleModal();
  };
  const disabledDate = (current: Dayjs) => {
    return current && current <= dayjs().startOf('day');
  };
  const disabledDateTime = (value: Dayjs | null) => {
    const current = dayjs(value);
    const isToday =
      dayjs(value).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD');
    let allHours = range(0, 24);
    if (maintenanceTime.length > 0) {
      maintenanceTime.forEach((item) => {
        const start = item.maintenance_start_time?.hour ?? 0;
        const end = item.maintenance_stop_time?.hour ?? 0;
        for (let i = start; i <= end; i++) {
          allHours[i] = -1;
        }
      });
    }
    if (maintenanceTime.length === 0 && !!value) {
      allHours = allHours.fill(-1);
    }
    if (isToday) {
      range(0, dayjs().hour()).forEach((item, i) => {
        allHours[item] = i;
      });
    }
    allHours = allHours.reduce<number[]>((sum, prev) => {
      if (prev === -1) {
        return sum;
      }
      return [...sum, prev];
    }, []);
    const allMinutes: Set<number> = new Set();
    const hour = current.hour();
    if (!Number.isNaN(hour)) {
      if (maintenanceTime.length > 0) {
        maintenanceTime.forEach((item) => {
          const startHour = item.maintenance_start_time?.hour ?? 0;
          const startMinute = item.maintenance_start_time?.minute ?? 0;
          const endHour = item.maintenance_stop_time?.hour ?? 0;
          const endMinute = item.maintenance_stop_time?.minute ?? 0;
          if (startHour === endHour && startHour === hour) {
            range(startMinute, endMinute).forEach((minute) => {
              allMinutes.add(minute);
            });
          } else if (hour === startHour) {
            range(startMinute, 60).forEach((minute) => {
              allMinutes.add(minute);
            });
          } else if (hour === endHour) {
            range(0, endMinute).forEach((minute) => {
              allMinutes.add(minute);
            });
          }
          if (hour > startHour && hour < endHour) {
            range(0, 60).forEach((minute) => {
              allMinutes.add(minute);
            });
          }
        });
      } else {
        range(0, 60).forEach((item) => {
          allMinutes.add(item);
        });
      }
    }
    if (isToday && hour === dayjs().hour()) {
      range(0, dayjs().minute()).forEach((item) => {
        allMinutes.delete(item);
      });
    }
    const disabledMinutes = range(0, 60).filter(
      (item) => !allMinutes.has(item)
    );
    return {
      disabledHours: () => allHours,
      disabledMinutes: () => disabledMinutes
    };
  };
  const createDefaultRangeTime = () => {
    if (maintenanceTime.length === 0) {
      return dayjs('00:00:00', 'HH:mm:ss');
    }
    const hour = maintenanceTime[0].maintenance_start_time?.hour ?? 0;
    const minute = maintenanceTime[0].maintenance_start_time?.minute ?? 0;
    return dayjs(`${timeAddZero(hour)}:${timeAddZero(minute)}:00`, 'HH:mm:ss');
  };
  const scheduleTimeHandle = async () => {
    const values = await form.validateFields();
    scheduleStart();
    submit(
      values?.schedule_time?.format('YYYY-MM-DDTHH:mm:ssZ')?.toString(),
      // #if [ee]
      !!enableNotificationConfirm,
      !!enableNotificationConfirm ? values.confirmation_method : undefined
      // #endif
    ).finally(() => {
      scheduleFinish();
      resetAndCloseScheduleModal();
    });
  };
  return (
    <BasicModal
      title={t('execWorkflow.detail.operator.onlineRegularly')}
      open={open}
      closable={false}
      footer={
        <>
          <BasicButton onClick={resetAndCloseScheduleModal}>
            {t('common.cancel')}
          </BasicButton>
          <BasicButton
            // #if [ee]
            disabled={submitButtonDisabled}
            // #endif
            type="primary"
            onClick={scheduleTimeHandle}
            loading={scheduleLoading}
            data-testid="confirm-button"
          >
            {t('execWorkflow.detail.operator.onlineRegularly')}
          </BasicButton>
        </>
      }
    >
      <FormStyleWrapper
        form={form}
        labelAlign="left"
        colon={false}
        className="clearPaddingBottom"
      >
        <ScheduleTimeModelDescribeStyleWrapper>
          <span className="whitespace-pre-line">
            {t('execWorkflow.detail.operator.maintenanceTime')}
          </span>
          <EmptyBox
            if={maintenanceTime.length > 0}
            defaultNode={t('execWorkflow.detail.operator.emptyMaintenanceTime')}
          >
            {maintenanceTime.map((time, i) => (
              <BasicTag key={i}>
                {timeAddZero(time.maintenance_start_time?.hour ?? 0)}:{' '}
                {timeAddZero(time.maintenance_start_time?.minute ?? 0)}-
                {timeAddZero(time.maintenance_stop_time?.hour ?? 0)}:{' '}
                {timeAddZero(time.maintenance_stop_time?.minute ?? 0)}
              </BasicTag>
            ))}
          </EmptyBox>
        </ScheduleTimeModelDescribeStyleWrapper>

        <FormItemNoLabelStyleWrapper
          name="schedule_time"
          validateFirst
          rules={[
            {
              required: true,
              message: t('common.form.placeholder.select', {
                name: t('execWorkflow.detail.operator.scheduleTime')
              })
            },
            {
              validator(_, rule: Dayjs) {
                if (rule.isBefore(dayjs())) {
                  return Promise.reject(
                    t('execWorkflow.detail.operator.execScheduledBeforeNow')
                  );
                }
                if (checkTimeInWithMaintenanceTime(rule, maintenanceTime)) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  t('execWorkflow.detail.operator.execScheduledErrorMessage')
                );
              }
            }
          ]}
        >
          <BasicDatePicker
            disabledDate={disabledDate}
            disabledTime={disabledDateTime}
            showTime={{
              defaultValue: createDefaultRangeTime()
            }}
          />
        </FormItemNoLabelStyleWrapper>

        {/* #if [ee] */}
        <ConfirmationSettingForm
          enable={open && !!enableNotificationConfirm}
          setSubmitButtonDisabled={setSubmitButtonDisabled}
          confirmTypeTokens={confirmTypeTokens}
          setConfirmTypeTokens={setConfirmTypeTokens}
        />
        {/* #endif */}
      </FormStyleWrapper>
    </BasicModal>
  );
};
export default ScheduleTimeModal;
