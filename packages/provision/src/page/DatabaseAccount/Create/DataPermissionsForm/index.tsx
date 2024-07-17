import {
  FormItemLabel,
  FormItemSubTitle
} from '@actiontech/shared/lib/components/FormCom';
import { useTranslation } from 'react-i18next';
import { Form, message } from 'antd';
import { BasicSelect, EmptyBox } from '@actiontech/shared';
import ServiceFiled from './ServiceField';
import { useRequest } from 'ahooks';
import auth from '@actiontech/shared/lib/api/provision/service/auth';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import useBusinessOptions from '../../../../hooks/useBusinessOptions';
import useServiceOptions from '../../../../hooks/useServiceOptions';
import { useEffect } from 'react';
import PermissionsField from './PermissionsField';
import { EventEmitterKey } from '../../../../data/enum';
import EventEmitter from '../../../../utils/EventEmitter';
import { CreateAccountFormType } from '../../index.type';

const DataPermissionsForm: React.FC<{ disabled?: boolean }> = ({
  disabled = false
}) => {
  const { t } = useTranslation();

  const form = Form.useFormInstance<CreateAccountFormType>();

  const [messageApi, contextHolder] = message.useMessage();

  const business = Form.useWatch('business', form);

  const service = Form.useWatch('service', form);

  const { businessOptions, updateBusinessList, loading } = useBusinessOptions();

  const {
    serviceOptions,
    updateServiceList,
    loading: servicesLoading
  } = useServiceOptions(true);

  const onSyncService = () => {
    SyncService.run();
  };

  const SyncService = useRequest(
    () =>
      auth.AuthSyncService({
        service_uids: [service ?? '']
      }),
    {
      manual: true,
      ready: !!service,
      onSuccess: (res) => {
        if (res?.data.code === ResponseCode.SUCCESS) {
          messageApi.success(t('databaseAccount.create.form.syncSuccessTips'));
          EventEmitter.emit(EventEmitterKey.Create_Account_Sync_Service);
        }
      }
    }
  );

  useEffect(() => {
    updateBusinessList();
  }, [updateBusinessList]);

  useEffect(() => {
    if (business) {
      updateServiceList(business);
      form.resetFields(['service']);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [business]);

  useEffect(() => {
    if (disabled) {
      updateServiceList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled]);

  return (
    <>
      {contextHolder}
      <FormItemSubTitle>
        {t('databaseAccount.create.permissionInfo')}
      </FormItemSubTitle>
      <EmptyBox if={!disabled}>
        <FormItemLabel
          name="business"
          label={t('databaseAccount.discovery.business')}
          rules={[{ required: true }]}
          className="has-required-style"
        >
          <BasicSelect
            disabled={disabled}
            loading={loading}
            options={businessOptions}
          />
        </FormItemLabel>
      </EmptyBox>
      <FormItemLabel
        name="service"
        label={t('databaseAccount.discovery.service')}
        rules={[{ required: true }]}
        className="has-required-style"
      >
        <ServiceFiled
          disabled={disabled}
          loading={servicesLoading}
          options={serviceOptions}
          onSyncService={onSyncService}
          syncServiceLoading={SyncService.loading}
        />
      </FormItemLabel>
      <FormItemLabel
        name="permissions"
        rules={[
          {
            required: true,
            message: t('databaseAccount.create.form.permissionErrorTips')
          }
        ]}
        className="has-required-style"
        wrapperCol={{ span: 24 }}
      >
        <PermissionsField />
      </FormItemLabel>
    </>
  );
};

export default DataPermissionsForm;
