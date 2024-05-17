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
import BaseInfoForm from '../Create/BaseInfoForm';
import { FormStyleWrapper } from '@actiontech/shared/lib/components/FormCom/style';
import { FormItemBigTitle } from '@actiontech/shared/lib/components/FormCom';
import DataPermissionsForm from '../Create/DataPermissionsForm';
import dbAccountService from '@actiontech/shared/lib/api/provision/service/db_account/';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useBoolean } from 'ahooks';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { generateDataPermissionValueByDataPermission } from '../index.utils';
import { normalPolicyValue } from '../../../hooks/useSecurityPolicy';

const UpdateDatabaseAccount = () => {
  const { t } = useTranslation();

  const urlParams = useParams<{ id: string }>();

  const [
    submitLoading,
    { setTrue: setSubmitPending, setFalse: setSubmitDone }
  ] = useBoolean();

  const [submitSuccess, { setTrue: setSubmitSuccess }] = useBoolean();

  const { projectID } = useCurrentProject();

  const [form] = Form.useForm<CreateAccountFormType>();

  const onSubmit = async () => {
    const values = await form.validateFields(['permissions']);
    setSubmitPending();
    const permissions = values.permissions.map((item) => ({
      data_object_uids: item.objectsParams,
      data_operation_set_uids: item.operationsValue
    }));
    dbAccountService
      .AuthUpdateDBAccount({
        project_uid: projectID,
        db_account_uid: urlParams.id ?? '',
        db_account: {
          data_permissions: permissions
        }
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setSubmitSuccess();
        }
      })
      .finally(() => {
        setSubmitDone();
      });
  };

  useEffect(() => {
    if (urlParams.id) {
      dbAccountService
        .AuthGetDBAccount({
          project_uid: projectID,
          db_account_uid: urlParams.id
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            const { data } = res.data;
            form.setFieldsValue({
              username: data?.account_info?.user,
              password: data?.account_info?.password,
              confirm_password: data?.account_info?.password,
              hostname: data?.account_info?.hostname,
              policy: data?.password_security_policy || normalPolicyValue,
              explanation: data?.account_info?.explanation,
              service: data?.db_service?.uid,
              permissions: generateDataPermissionValueByDataPermission(
                data?.data_permissions ?? [],
                data?.db_service?.uid ?? ''
              )
            });
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onReset = () => {
    form.resetFields(['permissions']);
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
            <BasicButton onClick={onReset} loading={submitLoading}>
              {t('common.reset')}
            </BasicButton>
            <BasicButton
              type="primary"
              loading={submitLoading}
              onClick={onSubmit}
            >
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
                {t('databaseAccount.update.title')}
              </FormItemBigTitle>
              <BaseInfoForm disabled />
              <DataPermissionsForm disabled />
            </CreateAccountFormStyleWrapper>
          </FormStyleWrapper>
        }
      >
        <BasicResult
          icon={<IconSuccessResult />}
          title={t('databaseAccount.update.result.success')}
          extra={
            <Space>
              <Link to={`/provision/project/${projectID}/database-account`}>
                <BasicButton type="primary">
                  {t('databaseAccount.create.returnText')}
                </BasicButton>
              </Link>
            </Space>
          }
        />
      </EmptyBox>
    </section>
  );
};

export default UpdateDatabaseAccount;
