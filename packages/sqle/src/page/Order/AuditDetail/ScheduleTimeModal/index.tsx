import { timeAddZero } from '@actiontech/shared/lib/utils/Common';
import { useBoolean, useRequest } from 'ahooks';
import { Form, Spin } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { range } from 'lodash';
import { Trans, useTranslation } from 'react-i18next';
import {
  BasicButton,
  BasicModal,
  BasicSwitch,
  BasicTag,
  EmptyBox
} from '@actiontech/shared';
import { ScheduleTimeModalProps } from './index.type';
import { checkTimeInWithMaintenanceTime } from '../../Common/utils';
import { FormItemNoLabelStyleWrapper } from '@actiontech/shared/lib/components/FormCom/FormItemCom/style';
import dayjs, { Dayjs } from 'dayjs';
import { BasicDatePicker } from '@actiontech/shared';
import { ScheduleTimeModelDescribeStyleWrapper } from '../style';
import {
  CustomLabelContent,
  FormItemLabel
} from '@actiontech/shared/lib/components/FormCom';
import { Link } from 'react-router-dom';
import configuration from '@actiontech/shared/lib/api/sqle/service/configuration';
import { UpdateWorkflowScheduleReqV2NotifyTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

const ScheduleTimeModal: React.FC<ScheduleTimeModalProps> = ({
  open,
  closeScheduleModal,
  maintenanceTime = [],
  submit
}) => {
  const { t } = useTranslation();
  const [form] = useForm();
  const [
    scheduleLoading,
    { setTrue: scheduleStart, setFalse: scheduleFinish }
  ] = useBoolean();

  // #if [ee]
  const enableWechatNotificationConfirm = Form.useWatch(
    'wechat_notification_confirmation',
    form
  );

  const { data: wechatAuditInfo, loading: getWechatAuditConfigInfoLoading } =
    useRequest(
      () =>
        configuration
          .getWechatAuditConfigurationV1()
          .then((res) => res.data.data ?? {}),
      {
        ready: !!enableWechatNotificationConfirm && !!open
      }
    );
  // #endif

  const resetAndCloseScheduleModal = () => {
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
            range(startMinute, endMinute).forEach((item) => {
              allMinutes.add(item);
            });
          } else if (hour === startHour) {
            range(startMinute, 60).forEach((item) => {
              allMinutes.add(item);
            });
          } else if (hour === endHour) {
            range(0, endMinute).forEach((item) => {
              allMinutes.add(item);
            });
          }
          if (hour > startHour && hour < endHour) {
            range(0, 60).forEach((item) => {
              allMinutes.add(item);
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
      !!enableWechatNotificationConfirm,
      !!enableWechatNotificationConfirm
        ? UpdateWorkflowScheduleReqV2NotifyTypeEnum.Wechat
        : undefined
      // #endif
    ).finally(() => {
      scheduleFinish();
      resetAndCloseScheduleModal();
    });
  };
  return (
    <BasicModal
      title={t('order.operator.onlineRegularly')}
      open={open}
      closable={false}
      footer={
        <>
          <BasicButton onClick={resetAndCloseScheduleModal}>
            {t('common.cancel')}
          </BasicButton>
          <BasicButton
            // #if [ee]
            disabled={
              !!enableWechatNotificationConfirm &&
              !wechatAuditInfo?.is_wechat_notification_enabled
            }
            // #endif

            type="primary"
            onClick={scheduleTimeHandle}
            loading={scheduleLoading}
            data-testid="confirm-button"
          >
            {t('order.operator.onlineRegularly')}
          </BasicButton>
        </>
      }
    >
      <Form form={form} labelAlign={'left'} colon={false}>
        <ScheduleTimeModelDescribeStyleWrapper>
          <span className="whitespace-pre-line">
            {t('order.operator.maintenanceTime')}
          </span>
          <EmptyBox
            if={maintenanceTime.length > 0}
            defaultNode={t('order.operator.emptyMaintenanceTime')}
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
                name: t('order.operator.scheduleTime')
              })
            },
            {
              validator(_, rule: Dayjs) {
                if (rule.isBefore(dayjs())) {
                  return Promise.reject(
                    t('order.operator.execScheduledBeforeNow')
                  );
                }

                if (checkTimeInWithMaintenanceTime(rule, maintenanceTime)) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  t('order.operator.execScheduledErrorMessage')
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
        <Spin spinning={getWechatAuditConfigInfoLoading} delay={400}>
          <FormItemLabel
            className="has-label-tip"
            label={
              <CustomLabelContent
                title={t('order.operator.scheduleTimeExecuteConfirmLabel')}
                tips={t('order.operator.scheduleTimeExecuteConfirmTips')}
              />
            }
            name="wechat_notification_confirmation"
            labelCol={{ span: 20 }}
            wrapperCol={{ span: 2, push: 1 }}
            valuePropName="checked"
          >
            <BasicSwitch />
          </FormItemLabel>

          <EmptyBox if={enableWechatNotificationConfirm}>
            <FormItemLabel
              className="has-label-tip"
              label={
                <CustomLabelContent
                  title={t('order.operator.scheduleTimeExecuteConfirmMethod')}
                  tips={
                    <Trans
                      i18nKey={
                        'order.operator.scheduleTimeExecuteConfirmMethodTips'
                      }
                    >
                      {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
                      <Link
                        target="_blank"
                        to="/system?active_tab=process_connection"
                      />
                    </Trans>
                  }
                />
              }
              name="confirmation_method"
              labelCol={{ span: 16 }}
              wrapperCol={{ span: 6, push: 2 }}
            >
              <EmptyBox if={!!wechatAuditInfo?.is_wechat_notification_enabled}>
                <BasicButton
                  style={{ width: '100%', height: 36 }}
                  type="primary"
                >
                  {t('order.operator.confirmMethodWechat')}
                </BasicButton>
              </EmptyBox>
            </FormItemLabel>
          </EmptyBox>
        </Spin>

        {/* #endif */}
      </Form>
    </BasicModal>
  );
};

export default ScheduleTimeModal;
