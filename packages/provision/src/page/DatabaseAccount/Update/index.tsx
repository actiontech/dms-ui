import {
  PageHeader,
  BasicButton,
  EmptyBox,
  BasicResult
} from '@actiontech/shared';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { Form, Space, Spin } from 'antd';
import { CreateAccountFormType } from '../index.type';
import { CreateAccountFormStyleWrapper } from '../style';
import BaseInfoForm from '../Create/BaseInfoForm';
import {
  formItemLayout,
  FormStyleWrapper
} from '@actiontech/shared/lib/components/FormCom/style';
import { FormItemBigTitle } from '@actiontech/shared/lib/components/FormCom';
import DataPermissionsForm from '../Create/DataPermissionsForm';
import dbAccountService from '@actiontech/shared/lib/api/provision/service/db_account/';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useBoolean, useRequest } from 'ahooks';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { NORMAL_POLICY_VALUE } from '../../../hooks/useSecurityPolicy';
import { LeftArrowOutlined, BriefcaseFilled } from '@actiontech/icons';
import Icon from '@ant-design/icons';
import {
  IDataPermissionForRole,
  IDBAccountDataPermission
} from '@actiontech/shared/lib/api/provision/service/common';
import DbAccountService from '@actiontech/shared/lib/api/provision/service/service';

// todo 后续在 dms-ui 调整至shared 后修改这里
import useAsyncParams from '../../../../../sqle/src/components/BackendForm/useAsyncParams';

const UpdateDatabaseAccount = () => {
  const { t } = useTranslation();

  const urlParams = useParams<{ id: string }>();

  const [
    submitLoading,
    { setTrue: setSubmitPending, setFalse: setSubmitDone }
  ] = useBoolean();

  const [submitSuccess, { setTrue: setSubmitSuccess }] = useBoolean();
  const [
    getDBAccountInfoPending,
    { setTrue: startGetDBAccountInfo, setFalse: getDBAccountFinish }
  ] = useBoolean();
  const { generateFormValueByParams } = useAsyncParams();

  const { projectID } = useCurrentProject();

  const [form] = Form.useForm<CreateAccountFormType>();

  const dbServiceID = Form.useWatch('dbServiceID', form);
  const dbType = Form.useWatch('dbType', form);

  const { data: dbAccountMeta, loading: getDBAccountMetaPending } = useRequest(
    () =>
      DbAccountService.AuthGetDBAccountMeta({
        project_uid: projectID,
        service_uid: dbServiceID,
        db_type: dbType
      }).then((res) => res.data.data?.db_account_metas),
    {
      ready: !!dbServiceID && !!dbType,
      refreshDeps: [dbServiceID, dbType]
    }
  );

  const onSubmit = async () => {
    const values = await form.validateFields([
      'dbRoles',
      'operationsPermissions'
    ]);
    setSubmitPending();
    const dataPermissions = values.operationsPermissions?.reduce<
      IDataPermissionForRole[]
    >((acc, cur) => {
      const operationIDs = [cur[0]];
      const objectIDs = cur.length > 1 ? cur.slice(1, cur.length) : [];

      const dataPermissionForRole: IDataPermissionForRole = {
        data_object_uids: objectIDs,
        data_operation_uids: operationIDs
      };
      return [...acc, dataPermissionForRole];
    }, []);
    dbAccountService
      .AuthUpdateDBAccount({
        project_uid: projectID,
        db_account_uid: urlParams.id ?? '',
        db_account: {
          db_roles: values.dbRoles,
          data_permissions: dataPermissions
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
      const generateOperationsPermissionValues = (
        dataPermissions?: IDBAccountDataPermission[]
      ): string[][] => {
        return (
          dataPermissions?.flatMap((permission) => {
            const { data_objects, data_operations = [] } = permission;

            if (!data_objects) {
              return data_operations.map((operation) => [operation.uid ?? '']);
            }

            return data_operations.flatMap((operation) =>
              data_objects.map((object) =>
                object.table_uid
                  ? [
                      operation.uid ?? '',
                      object.database_uid ?? '',
                      object.table_uid
                    ]
                  : [operation.uid ?? '', object.database_uid ?? '']
              )
            );
          }) ?? []
        );
      };

      startGetDBAccountInfo();
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
              policy: data?.password_security_policy || NORMAL_POLICY_VALUE,
              explanation: data?.account_info?.explanation,
              dbServiceID: data?.db_service?.uid,
              operationsPermissions: generateOperationsPermissionValues(
                data?.data_permissions
              ),
              additionalParams: generateFormValueByParams(
                data?.account_info?.additional_params ?? []
              ),
              dbRoles: data?.db_roles?.map((v) => v.uid ?? '')
            });
          }
        })
        .finally(() => {
          getDBAccountFinish();
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onReset = () => {
    form.resetFields(['operationsPermissions', 'dbRoles']);
  };

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
          <Spin
            delay={500}
            spinning={getDBAccountMetaPending || getDBAccountInfoPending}
          >
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
                  {t('databaseAccount.update.title')}
                </FormItemBigTitle>
                <BaseInfoForm
                  mode="update"
                  dbAccountMeta={dbAccountMeta ?? []}
                />
                <DataPermissionsForm mode="update" />
              </CreateAccountFormStyleWrapper>
            </FormStyleWrapper>
          </Spin>
        }
      >
        <BasicResult
          status="success"
          title={t('databaseAccount.update.result.success')}
          extra={
            <Link to={`/provision/project/${projectID}/database-account`}>
              <BasicButton type="primary">
                {t('databaseAccount.create.returnText')}
              </BasicButton>
            </Link>
          }
        />
      </EmptyBox>
    </section>
  );
};

export default UpdateDatabaseAccount;
