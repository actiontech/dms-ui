import { Form } from 'antd';
import { BasicSelect, BasicToolTip } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { AccountDiscoveryFormType } from '../../index.type';
import { FormInstance } from 'antd/lib/form/Form';
import useServiceOptions from '../../../../hooks/useServiceOptions';
import { useEffect } from 'react';
import AccountTableField from './AccountTableField';
import dbAccountService from '@actiontech/shared/lib/api/provision/service/db_account/';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { IAuthDiscoveryDBAccountParams } from '@actiontech/shared/lib/api/provision/service/db_account/index.d';
import { useRequest } from 'ahooks';
import useServiceEnvironment from '../../../../hooks/useServiceEnvironment';

const DataBaseInfoField: React.FC<{
  form: FormInstance<AccountDiscoveryFormType>;
  visible: boolean;
}> = ({ form, visible }) => {
  const { t } = useTranslation();

  const { projectID } = useCurrentProject();

  const service = Form.useWatch('service', form);

  const environment = Form.useWatch('environment', form);

  const {
    updateEnvironmentList,
    loading: environmentLoading,
    environmentOptions
  } = useServiceEnvironment();

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
    updateEnvironmentList({
      namespace_uid: projectID
    });
  }, [updateEnvironmentList, projectID]);

  useEffect(() => {
    if (environment) {
      updateServiceList({
        filter_by_environment_tag_uid: environment
      });
      form.resetFields(['service']);
      setData(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [environment]);

  useEffect(() => {
    if (!visible) {
      setData(undefined);
    }
  }, [setData, visible]);

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="environment"
        label={t('databaseAccount.discovery.environment')}
        rules={[{ required: true }]}
      >
        <BasicSelect
          loading={environmentLoading}
          options={environmentOptions}
          placeholder={t('common.form.placeholder.select', {
            name: t('databaseAccount.discovery.environment')
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
          options={servicesLoading ? [] : serviceOptions}
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
