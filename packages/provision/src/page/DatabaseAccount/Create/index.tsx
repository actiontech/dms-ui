import {
  PageHeader,
  BasicButton,
  EmptyBox,
  BasicResult
} from '@actiontech/shared';
import { Link } from 'react-router-dom';
import {
  IconLeftArrow,
  IconSuccessResult
} from '@actiontech/shared/lib/Icon/common';
import { useTranslation } from 'react-i18next';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { Form, Space } from 'antd';
import { CreateAccountFormType } from '../index.type';
import { CreateAccountFormStyleWrapper } from '../style';
import { IconAccountCreateTitle } from '../../../icon/account';
import BaseInfoForm from './BaseInfoForm';
import { FormStyleWrapper } from '@actiontech/shared/lib/components/FormCom/style';
import { FormItemBigTitle } from '@actiontech/shared/lib/components/FormCom';
import DataPermissionsForm from './DataPermissionsForm';
import { useBoolean } from 'ahooks';
import { useState } from 'react';
import { IAuthAddDBAccountParams } from '@actiontech/shared/lib/api/provision/service/db_account/index.d';
import PreviewModal from './PreviewModal';
import { NORMAL_POLICY_VALUE } from '../../../hooks/useSecurityPolicy';

const CreateDatabaseAccount = () => {
  const { t } = useTranslation();

  const [params, setParams] = useState<IAuthAddDBAccountParams>();

  const [
    submitSuccess,
    { setTrue: setSubmitSuccess, setFalse: setSubmitFailed }
  ] = useBoolean();

  const { projectID } = useCurrentProject();

  const [form] = Form.useForm<CreateAccountFormType>();

  const onSubmit = async () => {
    const values = await form.validateFields();
    const permissions = values.permissions.map((item) => ({
      data_object_uids: item.objectsParams,
      data_operation_set_uids: item.operationsValue
    }));
    setParams({
      project_uid: projectID,
      db_account: {
        db_service_uid: values.service,
        db_account: {
          username: values.username,
          password: values.password,
          hostname: values.hostname,
          explanation: values.explanation
        },
        effective_time_day: values.effective_time_day,
        data_permissions: permissions,
        used_by_sql_workbench: false,
        password_security_policy:
          values.policy === NORMAL_POLICY_VALUE ? undefined : values.policy
      }
    });
  };

  const onSuccess = () => {
    setParams(undefined);
    setSubmitSuccess();
  };

  const onReset = () => {
    form.resetFields();
    setParams(undefined);
  };

  const onContinue = () => {
    form.resetFields();
    setSubmitFailed();
  };

  return (
    <section>
      <PageHeader
        fixed
        title={
          <Link to={`/provision/project/${projectID}/database-account`}>
            <BasicButton icon={<IconLeftArrow />}>
              {t('databaseAccount.create.returnText')}
            </BasicButton>
          </Link>
        }
        extra={
          <Space hidden={submitSuccess}>
            <BasicButton onClick={onReset}>{t('common.reset')}</BasicButton>
            <BasicButton type="primary" onClick={onSubmit}>
              {t('common.save')}
            </BasicButton>
          </Space>
        }
      />
      <EmptyBox
        if={submitSuccess}
        defaultNode={
          <FormStyleWrapper
            form={form}
            colon={false}
            labelAlign="left"
            labelCol={{ span: 14 }}
            wrapperCol={{ span: 10 }}
            className="hasTopHeader clearPaddingBottom"
          >
            <CreateAccountFormStyleWrapper>
              <FormItemBigTitle>
                <IconAccountCreateTitle />
                {t('databaseAccount.create.title')}
              </FormItemBigTitle>
              <BaseInfoForm />
              <DataPermissionsForm />
            </CreateAccountFormStyleWrapper>
          </FormStyleWrapper>
        }
      >
        <BasicResult
          icon={<IconSuccessResult />}
          title={t('databaseAccount.create.result.success')}
          extra={
            <Space>
              <BasicButton type="primary" onClick={onContinue}>
                {t('databaseAccount.create.result.continue')}
              </BasicButton>
            </Space>
          }
        />
      </EmptyBox>
      <PreviewModal
        params={params}
        setParams={setParams}
        onSuccess={onSuccess}
      />
    </section>
  );
};

export default CreateDatabaseAccount;
