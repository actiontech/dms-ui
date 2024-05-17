import { Form } from 'antd';
import { BasicSelect } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { AccountDiscoveryFormType } from '../../index.type';
import { FormInstance } from 'antd/lib/form/Form';
import useBusinessOptions from '../../../../hooks/useBusinessOptions';
import useServiceOptions from '../../../../hooks/useServiceOptions';
import { useEffect, useState } from 'react';
import AccountTableField from './AccountTableField';
import dbAccountService from '@actiontech/shared/lib/api/provision/service/db_account/';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { IAuthDiscoveryDBAccountParams } from '@actiontech/shared/lib/api/provision/service/db_account/index.d';
import { IDBAccountBody } from '@actiontech/shared/lib/api/provision/service/common';
import { ResponseCode } from '@actiontech/shared/lib/enum';

const DataBaseInfoField: React.FC<{
  form: FormInstance<AccountDiscoveryFormType>;
  visible: boolean;
}> = ({ form, visible }) => {
  const { t } = useTranslation();

  const { projectID } = useCurrentProject();

  const service = Form.useWatch('service', form);

  const business = Form.useWatch('business', form);

  const [data, setData] = useState<IDBAccountBody[]>([]);

  const [accountLoading, setAccountLoading] = useState<boolean>(false);

  const { businessOptions, updateBusinessList, loading } = useBusinessOptions();

  useEffect(() => {
    if (service) {
      const params: IAuthDiscoveryDBAccountParams = {
        project_uid: projectID,
        db_service_uid: service
      };
      setAccountLoading(true);
      dbAccountService
        .AuthDiscoveryDBAccount(params)
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            setData(res.data.data?.accounts ?? []);
          }
        })
        .finally(() => {
          setAccountLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service]);

  const {
    serviceOptions,
    updateServiceList,
    loading: servicesLoading
  } = useServiceOptions();

  useEffect(() => {
    updateBusinessList();
  }, [updateBusinessList]);

  useEffect(() => {
    if (business) {
      updateServiceList(business);
      form.resetFields(['service']);
      setData([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [business]);

  useEffect(() => {
    if (!visible) {
      setData([]);
    }
  }, [visible]);

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="business"
        label={t('databaseAccount.discovery.business')}
        rules={[{ required: true }]}
      >
        <BasicSelect
          loading={loading}
          options={businessOptions}
          placeholder={t('common.form.placeholder.select', {
            name: t('databaseAccount.discovery.business')
          })}
        />
      </Form.Item>
      <Form.Item
        label={t('databaseAccount.discovery.service')}
        name="service"
        rules={[
          {
            required: true
          }
        ]}
      >
        <BasicSelect
          className="data-service-select"
          loading={servicesLoading}
          options={serviceOptions}
          placeholder={t('common.form.placeholder.select', {
            name: t('databaseAccount.discovery.service')
          })}
        />
      </Form.Item>
      <Form.Item
        label={t('databaseAccount.discovery.dbAccount')}
        name="account"
        rules={[
          {
            required: true
          }
        ]}
      >
        <AccountTableField data={data} loading={accountLoading} />
      </Form.Item>
    </Form>
  );
};

export default DataBaseInfoField;
