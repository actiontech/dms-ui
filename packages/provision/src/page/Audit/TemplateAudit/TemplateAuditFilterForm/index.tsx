import { Col, DatePicker, Form, Input, Select } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TableFilterForm } from '~/components/ProvisionTable';
import locale from 'antd/es/date-picker/locale/zh_CN';
import {
  filterFormButtonLayoutFactory,
  FilterFormColLayout
} from '~/data/common';
import { eventType } from '~/page/Audit/TemplateAudit/TableColumns';
import { useSearchParams } from 'react-router-dom';
export interface IFilteredInfo {
  filter_by_data_permission_template_name?: string;
  filter_by_data_object_service_name?: string;
  filter_by_create_user?: string;
  filter_by_event_type?: string;
  filter_by_generated_time?: [moment.Moment | null, moment.Moment | null];
  filter_by_generated_time_start?: string;
  filter_by_generated_time_end?: string;
}

const TemplateAuditFilterForm = () => {
  const { t } = useTranslation();
  const [filterForm] = Form.useForm<IFilteredInfo>();

  const [params, setParams] = useSearchParams();

  useEffect(() => {
    const start = params.get('filter_by_generated_time_start');
    const end = params.get('filter_by_generated_time_end');

    filterForm.setFieldsValue({
      filter_by_data_permission_template_name:
        params.get('filter_by_data_permission_template_name') ?? undefined,
      filter_by_data_object_service_name:
        params.get('filter_by_data_object_service_name') ?? undefined,
      filter_by_create_user: params.get('filter_by_create_user') ?? undefined,
      filter_by_event_type: params.get('filter_by_event_type') ?? undefined,
      filter_by_generated_time_start:
        params.get('filter_by_generated_time_start') ?? undefined,
      filter_by_generated_time_end:
        params.get('filter_by_generated_time_end') ?? undefined,
      filter_by_generated_time: [
        start ? moment(start) : null,
        end ? moment(end) : null
      ]
    });
  }, [filterForm, params]);

  return (
    <TableFilterForm
      form={filterForm}
      updateFilteredInfo={setParams as any}
      filterFormButtonLayout={filterFormButtonLayoutFactory(12, 16, 6)}
    >
      <Col {...FilterFormColLayout}>
        <Form.Item
          name="filter_by_data_object_service_name"
          label={t('auth.columns.dataObjectService')}
        >
          <Input />
        </Form.Item>
      </Col>
      <Col {...FilterFormColLayout}>
        <Form.Item
          name="filter_by_data_permission_template_name"
          label={t('provisionAudit.templateAudit.columns.template')}
        >
          <Input />
        </Form.Item>
      </Col>
      <Col {...FilterFormColLayout}>
        <Form.Item
          name="filter_by_create_user"
          label={t('provisionAudit.authAudit.columns.actionUser')}
        >
          <Input />
        </Form.Item>
      </Col>
      <Col {...FilterFormColLayout}>
        <Form.Item
          name="filter_by_event_type"
          label={t('provisionAudit.authAudit.columns.actionType')}
        >
          <Select
            options={Object.entries(eventType).map(([value, label]) => ({
              value,
              label
            }))}
            allowClear={true}
          />
        </Form.Item>
      </Col>
      <Col xxl={12} xl={16} sm={24}>
        <Form.Item
          name="filter_by_generated_time"
          label={t('provisionAudit.authAudit.columns.time')}
        >
          <DatePicker.RangePicker
            locale={locale}
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            onChange={(values) => {
              filterForm.setFieldsValue({
                filter_by_generated_time_start: values?.[0]?.format(),
                filter_by_generated_time_end: values?.[1]?.format()
              });
            }}
          />
        </Form.Item>
      </Col>
      <Form.Item hidden={true} name="filter_by_generated_time_start">
        <Input />
      </Form.Item>
      <Form.Item hidden={true} name="filter_by_generated_time_end">
        <Input />
      </Form.Item>
    </TableFilterForm>
  );
};

export default TemplateAuditFilterForm;
