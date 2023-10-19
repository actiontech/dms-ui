import { Col, Form, Select } from 'antd';
import { t } from '~/locale';
import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { TableFilterForm } from '~/components/ProvisionTable';
import {
  filterFormButtonLayoutFactory,
  FilterFormColLayout,
  ResponseCode
} from '~/data/common';
import { useRequest } from 'ahooks';
import { AxiosResponse } from 'axios';
import { IListTipsByAuthorizationKeyReturn } from '@actiontech/shared/lib/api/provision/service/auth/index.d';
import {
  AuthListAuthorizationFilterByStatusEnum,
  ListTipsByAuthorizationKeyKeyEnum
} from '@actiontech/shared/lib/api/provision/service/auth/index.enum';
import auth from '@actiontech/shared/lib/api/provision/service/auth';
export interface IFilteredInfo {
  filter_by_purpose?: string;
  filter_by_business?: string;
  filter_by_status?: AuthListAuthorizationFilterByStatusEnum;
  filter_by_data_object_service_dns?: string;
}

interface IAuthListFilterForm {
  setFilteredInfo: (info: IFilteredInfo | null) => void;
}

const generateSelectOptions = (
  res: AxiosResponse<IListTipsByAuthorizationKeyReturn, any>
) => {
  if (res.data.code === ResponseCode.SUCCESS) {
    return res.data.data?.tips?.map((item) => ({
      value: item,
      label: item
    }));
  }
};

const AuthListFilterForm: FC<IAuthListFilterForm> = ({ setFilteredInfo }) => {
  const { t } = useTranslation();
  const [filterForm] = Form.useForm<IFilteredInfo>();

  const { purpose } = useParams();
  useEffect(() => {
    if (purpose !== undefined) {
      filterForm.setFieldsValue({
        filter_by_purpose: purpose
      });
      setFilteredInfo({
        filter_by_purpose: purpose
      });
    }
  }, [filterForm, purpose, setFilteredInfo]);

  const { data: purposeOptions } = useRequest(() =>
    auth
      .ListTipsByAuthorizationKey({
        key: ListTipsByAuthorizationKeyKeyEnum.purpose
      })
      .then(generateSelectOptions)
  );
  const { data: businessOptions } = useRequest(() =>
    auth
      .ListTipsByAuthorizationKey({
        key: ListTipsByAuthorizationKeyKeyEnum.business
      })
      .then(generateSelectOptions)
  );
  const { data: serviceOptions } = useRequest(() =>
    auth
      .ListTipsByAuthorizationKey({
        key: ListTipsByAuthorizationKeyKeyEnum.data_service
      })
      .then(generateSelectOptions)
  );

  return (
    <TableFilterForm
      form={filterForm}
      updateFilteredInfo={setFilteredInfo}
      filterFormButtonLayout={filterFormButtonLayoutFactory(12, 8, 18)}
    >
      <Col {...FilterFormColLayout}>
        <Form.Item
          name="filter_by_purpose"
          label={t('auth.addAuth.steps.purpose')}
        >
          <Select options={purposeOptions} showSearch allowClear />
        </Form.Item>
      </Col>
      <Col {...FilterFormColLayout}>
        <Form.Item
          name="filter_by_business"
          label={t('auth.addAuth.baseForm.business')}
        >
          <Select options={businessOptions} showSearch allowClear />
        </Form.Item>
      </Col>
      <Col {...FilterFormColLayout}>
        <Form.Item
          name="filter_by_status"
          label={t('auth.addAuth.baseForm.status')}
        >
          <Select allowClear={true} options={statusOptions} />
        </Form.Item>
      </Col>
      <Col {...FilterFormColLayout}>
        <Form.Item
          name="filter_by_data_object_service_dns"
          label={t('auth.addAuth.baseForm.dataSourceDns')}
        >
          <Select options={serviceOptions} showSearch allowClear />
        </Form.Item>
      </Col>
    </TableFilterForm>
  );
};

export default AuthListFilterForm;

const statusOptions = [
  {
    value: AuthListAuthorizationFilterByStatusEnum.effective,
    label: t('auth.columns.effective')
  },
  {
    value: AuthListAuthorizationFilterByStatusEnum.expired,
    label: t('auth.columns.invalid')
  },
  {
    value: AuthListAuthorizationFilterByStatusEnum.expiring,
    label: t('auth.columns.expiring')
  }
];
