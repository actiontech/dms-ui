import { Form } from 'antd';
import { BasicSelect, BasicToolTip } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { AccountDiscoveryFormType } from '../../index.type';
import { FormInstance } from 'antd/lib/form/Form';
import useBusinessOptions from '../../../../hooks/useBusinessOptions';
import useServiceOptions from '../../../../hooks/useServiceOptions';
import { useEffect } from 'react';
import AccountTableField from './AccountTableField';
import dbAccountService from '@actiontech/shared/lib/api/provision/service/db_account/';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { IAuthDiscoveryDBAccountParams } from '@actiontech/shared/lib/api/provision/service/db_account/index.d';
import { useRequest } from 'ahooks';

const DataBaseInfoField: React.FC<{
  form: FormInstance<AccountDiscoveryFormType>;
  visible: boolean;
}> = ({ form, visible }) => {
  const { t } = useTranslation();

  const { projectID } = useCurrentProject();

  const service = Form.useWatch('service', form);

  const business = Form.useWatch('business', form);

  const { businessOptions, updateBusinessList, loading } = useBusinessOptions();

  const {
    data,
    mutate: setData,
    loading: accountLoading,
    refresh
  } = useRequest(
    () => {
      const params: IAuthDiscoveryDBAccountParams = {
        project_uid: projectID,
        db_service_uid: service
      };
      return dbAccountService.AuthDiscoveryDBAccount(params).then((res) => {
        return res.data.data?.accounts?.map((acc, index) => ({
          ...acc,
          id: `${acc.user}_${index}`
        }));
      });
    },
    {
      ready: !!service,
      refreshDeps: [service]
    }
  );

  const {
    serviceOptions,
    updateServiceList,
    loading: servicesLoading
  } = useServiceOptions(true);

  useEffect(() => {
    updateBusinessList();
  }, [updateBusinessList]);

  useEffect(() => {
    if (business) {
      updateServiceList(business);
      form.resetFields(['service']);
      setData(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [business]);

  useEffect(() => {
    if (!visible) {
      setData(undefined);
    }
  }, [setData, visible]);

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
        label={
          <BasicToolTip
            suffixIcon
            title={t('databaseAccount.discovery.syncAccountTip')}
          >
            {t('databaseAccount.discovery.dbAccount')}
          </BasicToolTip>
        }
        extra={
          typeof data?.length === 'number'
            ? t('databaseAccount.discovery.dbAccountNumber', {
                number: data?.length
              })
            : undefined
        }
        name="account"
        rules={[
          {
            required: true,
            message: t('databaseAccount.discovery.pleaseSelectDBAccount')
          }
        ]}
      >
        <AccountTableField
          refresh={refresh}
          data={data}
          loading={accountLoading}
        />
      </Form.Item>
    </Form>
  );
};

export default DataBaseInfoField;
