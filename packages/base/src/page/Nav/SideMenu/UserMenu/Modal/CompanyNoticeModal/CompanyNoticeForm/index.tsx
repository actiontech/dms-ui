import { useTranslation } from 'react-i18next';
import { Form, FormInstance } from 'antd';
import { BasicInput, BasicRangePicker } from '@actiontech/dms-kit';
import dayjs from 'dayjs';
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
  disabled?: boolean;
  onValuesChange?: () => void;
}> = ({ form, disabled, onValuesChange }) => {
  const { t } = useTranslation();

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
    const startTime = form.getFieldValue('validPeriod')?.[0];
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
    <Form form={form} layout="vertical" onValuesChange={onValuesChange}>
      <Form.Item
        name="notice_str"
        label={t('dmsSystem.notification.noticeContent')}
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
