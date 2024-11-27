import {
  PageHeader,
  BasicButton,
  EmptyBox,
  BasicResult
} from '@actiontech/shared';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { Form, Space } from 'antd';
import { CreateAccountFormType } from '../index.type';
import { CreateAccountFormStyleWrapper } from '../style';
import BaseInfoForm from './BaseInfoForm';
import {
  formItemLayout,
  FormStyleWrapper
} from '@actiontech/shared/lib/components/FormCom/style';
import { FormItemBigTitle } from '@actiontech/shared/lib/components/FormCom';
import DataPermissionsForm from './DataPermissionsForm';
import { useBoolean, useRequest } from 'ahooks';
import { useEffect, useState } from 'react';
import { IAuthAddDBAccountParams } from '@actiontech/shared/lib/api/provision/service/db_account/index.d';
import PreviewModal from './PreviewModal';
import { NORMAL_POLICY_VALUE } from '../../../hooks/useSecurityPolicy';
import { LeftArrowOutlined, BriefcaseFilled } from '@actiontech/icons';
import Icon from '@ant-design/icons';
import DbAccountService from '@actiontech/shared/lib/api/provision/service/service';
import { generatePrivilegesSubmitDataByFormValues } from '../../../components/DatabasePrivilegesSelector/ObjectPrivilegesSelector/utils';

// todo 后续在 dms-ui 调整至shared 后修改这里
import useAsyncParams from '../../../../../sqle/src/components/BackendForm/useAsyncParams';

const CreateDatabaseAccount = () => {
  const { t } = useTranslation();

  const [params, setParams] = useState<IAuthAddDBAccountParams>();

  const { generateFormValueByParams } = useAsyncParams();

  const [
    submitSuccess,
    { setTrue: setSubmitSuccess, setFalse: setSubmitFailed }
  ] = useBoolean();

  const { projectID } = useCurrentProject();

  const [form] = Form.useForm<CreateAccountFormType>();
  const selectedDBServiceID = Form.useWatch('dbServiceID', form);
  const selectedDBType = Form.useWatch('dbType', form);

  const { data: dbAccountMeta } = useRequest(
    () =>
      DbAccountService.AuthGetDBAccountMeta({
        project_uid: projectID,
        service_uid: selectedDBServiceID,
        db_type: selectedDBType
      }).then((res) => res.data.data?.db_account_metas),
    {
      ready: !!selectedDBServiceID && !!selectedDBType,
      refreshDeps: [selectedDBServiceID]
    }
  );

  const onSubmit = async () => {
    const values = await form.validateFields();

    const mergeFromValueWithDescIntoParams = () => {
      return (dbAccountMeta ?? []).map((item) => {
        const temp = {
          key: item.key,
          value: item.value,
          desc: item.desc
        };
        if (
          item.key &&
          Object.prototype.hasOwnProperty.call(
            values.additionalParams,
            item.key
          )
        ) {
          const tempVal = values.additionalParams[item.key];
          if (typeof tempVal === 'boolean') {
            temp.value = tempVal ? 'true' : 'false';
          } else {
            temp.value = String(tempVal);
          }
        }
        return temp;
      });
    };

    setParams({
      project_uid: projectID,
      db_account: {
        db_roles: values.dbRoles,
        db_service_uid: values.dbServiceID,
        db_account: {
          username: values.username,
          password: values.password,
          hostname: values.hostname,
          explanation: values.explanation,
          additional_params: mergeFromValueWithDescIntoParams()
        },
        effective_time_day: values.effective_time_day,
        data_permissions: generatePrivilegesSubmitDataByFormValues(
          values.systemPrivileges ?? [],
          values.objectPrivileges ?? []
        ),
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

  useEffect(() => {
    if (dbAccountMeta && dbAccountMeta.length > 0) {
      form.setFieldsValue({
        additionalParams: generateFormValueByParams(dbAccountMeta)
      });
    }
  }, [dbAccountMeta, form, generateFormValueByParams]);

  return (
    <section>
      <PageHeader
        fixed
        title={
          <Link to={`/provision/project/${projectID}/database-account`}>
            <BasicButton icon={<LeftArrowOutlined />}>
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
            {...formItemLayout.spaceBetween}
            className="hasTopHeader clearPaddingBottom"
          >
            <CreateAccountFormStyleWrapper>
              <FormItemBigTitle>
                <Icon component={BriefcaseFilled} className="title-icon" />
                {t('databaseAccount.create.title')}
              </FormItemBigTitle>
              <BaseInfoForm dbAccountMeta={dbAccountMeta ?? []} mode="create" />
              <DataPermissionsForm mode="create" />
            </CreateAccountFormStyleWrapper>
          </FormStyleWrapper>
        }
      >
        <BasicResult
          status="success"
          title={t('databaseAccount.create.result.success')}
          extra={
            <Space>
              <BasicButton type="primary" onClick={onContinue}>
                {t('databaseAccount.create.result.continue')}
              </BasicButton>
              <Link to={`/provision/project/${projectID}/database-account`}>
                <BasicButton type="primary">
                  {t('databaseAccount.create.returnText')}
                </BasicButton>
              </Link>
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
