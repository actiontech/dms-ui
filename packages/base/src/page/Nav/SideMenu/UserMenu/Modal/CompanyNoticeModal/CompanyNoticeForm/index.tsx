import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, FormInstance } from 'antd';
import { BasicInput, BasicRangePicker } from '@actiontech/dms-kit';
import dayjs, { Dayjs } from 'dayjs';
import { RangePickerProps } from 'antd/es/date-picker';
import { ICompanyNoticeFormValues } from './index.type';

const range = (start: number, end: number) => {
  const result: number[] = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};

export const CompanyNoticeForm: React.FC<{
  form: FormInstance<ICompanyNoticeFormValues>;
  initialValues?: Partial<ICompanyNoticeFormValues>;
  disabled?: boolean;
  onValuesChange?: () => void;
}> = ({ form, initialValues, disabled, onValuesChange }) => {
  const { t } = useTranslation();
  const startTimeRef = useRef<Dayjs | null>(null);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        validPeriod: initialValues.validPeriod ?? undefined
      });
      const period = initialValues.validPeriod;
      startTimeRef.current = Array.isArray(period) ? period[0] ?? null : null;
    }
  }, [initialValues, form]);

  const disabledRangeTime: RangePickerProps['disabledTime'] = (date, type) => {
    const now = dayjs();
    if (type === 'start') {
      if (!date || date.isAfter(now, 'day')) {
        return {};
      }
      return {
        disabledHours: () => range(0, now.hour()),
        disabledMinutes: (hour) =>
          hour === now.hour() ? range(0, now.minute()) : [],
        disabledSeconds: (hour, minute) =>
          hour === now.hour() && minute === now.minute()
            ? range(0, now.second())
            : []
      };
    }
    const startTime = startTimeRef.current;
    if (!startTime || !date || !date.isSame(startTime, 'day')) {
      return {};
    }
    return {
      disabledHours: () => range(0, startTime.hour()),
      disabledMinutes: (hour) =>
        hour === startTime.hour() ? range(0, startTime.minute()) : [],
      disabledSeconds: (hour, minute) =>
        hour === startTime.hour() && minute === startTime.minute()
          ? range(0, startTime.second())
          : []
    };
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onValuesChange={(_, all) => {
        const period = all.validPeriod;
        if (Array.isArray(period) && period[0]) {
          startTimeRef.current = period[0];
        }
        onValuesChange?.();
      }}
    >
      <Form.Item
        name="notice_str"
        label={t('dmsSystem.notification.noticeContent')}
        rules={[
          {
            required: true,
            message: t('common.form.rule.require', {
              name: t('dmsSystem.notification.noticeContent')
            })
          }
        ]}
      >
        <BasicInput.TextArea
          autoSize={{ minRows: 2, maxRows: 20 }}
          disabled={disabled}
          placeholder={t('common.form.placeholder.input', {
            name: t('dmsSystem.notification.noticeContent')
          })}
        />
      </Form.Item>
      <Form.Item
        name="validPeriod"
        label={t('dmsSystem.notification.validPeriod')}
        rules={[
          {
            required: true,
            message: t('dmsSystem.notification.timeRangeRequired')
          },
          {
            validator: (_, value) => {
              if (!value || !Array.isArray(value) || !value[0] || !value[1]) {
                return Promise.resolve();
              }
              if (value[0].isBefore(value[1])) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error(t('dmsSystem.notification.timeRangeValidate'))
              );
            }
          }
        ]}
      >
        <BasicRangePicker
          showTime={{ hideDisabledOptions: true }}
          disabledDate={(current) =>
            current ? current.isBefore(dayjs(), 'day') : false
          }
          disabledTime={disabledRangeTime}
          placeholder={[
            t('dmsSystem.notification.startTimePlaceholder'),
            t('dmsSystem.notification.endTimePlaceholder')
          ]}
          disabled={disabled}
          className="company-notice-date-picker"
          getPopupContainer={() => document.body}
        />
      </Form.Item>
    </Form>
  );
};
