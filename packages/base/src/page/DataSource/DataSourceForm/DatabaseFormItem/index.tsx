import { useBoolean } from 'ahooks';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormInstance } from 'antd5';
import EmitterKey from '../../../../data/EmitterKey';
import EventEmitter from '../../../../utils/EventEmitter';
import { DataSourceFormField } from '../index.type';
import {
  BasicInput,
  BasicSelect,
  BasicSwitch,
  EmptyBox,
  TestDatabaseConnectButton
} from '@actiontech/shared';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import {
  FormItemLabel,
  FormItemNoLabel
} from '@actiontech/shared/lib/components/FormCom';
import { validatorPort } from '@actiontech/shared/lib/utils/FormRule';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import AutoCreatedFormItemByApi from 'sqle/src/components/BackendForm/AutoCreatedFormItemByApi';
import useAsyncParams from 'sqle/src/components/BackendForm/useAsyncParams';
import { FormItem } from 'sqle/src/components/BackendForm';

const DatabaseFormItem: React.FC<{
  form: FormInstance<DataSourceFormField>;
  isUpdate?: boolean;
  databaseTypeChange?: (values: string) => void;
  generateDriverSelectOptions?: () => JSX.Element[];
  getDriverMetaLoading: boolean;
  currentAsyncParams?: FormItem[];
  isExternalInstance?: boolean;
}> = (props) => {
  const { t } = useTranslation();
  const [loading, { setTrue: setLoadingTrue, setFalse: setLoadingFalse }] =
    useBoolean();

  const [connectAble, setConnectAble] = useState(false);
  const [connectErrorMessage, setConnectErrorMessage] = useState('');
  const [initHide, { setFalse: setInitHideFalse, setTrue: setInitHideTrue }] =
    useBoolean(true);
  const [needUpdatePassword, setNeedUpdatePassword] = useState(false);

  const { projectID } = useCurrentProject();

  const changeNeedUpdatePassword = (check: boolean) => {
    setNeedUpdatePassword(check);
    props.form.setFieldsValue({ needUpdatePassword: check });
  };

  const { dmsMergeFromValueIntoParams } = useAsyncParams();

  const testDatabaseConnect = async () => {
    const values = await props.form.validateFields([
      'ip',
      'password',
      'port',
      'user',
      'type',
      'params'
    ]);
    if (values.params && props.currentAsyncParams) {
      values.asyncParams = dmsMergeFromValueIntoParams(
        values.params,
        props.currentAsyncParams
      );
      delete values.params;
    }

    setLoadingTrue();
    dms
      .CheckDBServiceIsConnectable({
        db_service: {
          host: values.ip,
          port: `${values.port}`,
          user: values.user,
          db_type: values.type,
          password: values.password
        },
        project_uid: projectID
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          const connections = res.data.data ?? [];
          const isConnectable = connections.every(
            (connection) => !!connection?.is_connectable
          );
          const connectErrorMessage = connections.reduce(
            (acc, cur, curIndex) =>
              !!cur?.is_connectable
                ? acc
                : acc +
                  `${cur.component}: ${cur?.connect_error_message?.replace(
                    /\n$/,
                    ''
                  )} ${curIndex < connections.length - 1 ? '\n\r' : ''}`,
            ''
          );

          setConnectAble(isConnectable);
          setConnectErrorMessage(connectErrorMessage);
        }
      })
      .finally(() => {
        setInitHideFalse();
        setLoadingFalse();
      });
  };

  useEffect(() => {
    const resetConnectAbleStatus = () => {
      setInitHideTrue();
    };
    EventEmitter.subscribe(
      EmitterKey.Reset_Test_Data_Source_Connect,
      resetConnectAbleStatus
    );
    return () => {
      EventEmitter.unsubscribe(
        EmitterKey.Reset_Test_Data_Source_Connect,
        resetConnectAbleStatus
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <FormItemLabel
        className="has-required-style"
        label={t('dmsDataSource.dataSourceForm.type')}
        name="type"
        rules={[
          {
            required: true
          }
        ]}
      >
        <BasicSelect
          placeholder={t('common.form.placeholder.select', {
            name: t('dmsDataSource.dataSourceForm.type')
          })}
          allowClear
          showSearch
          disabled={props.isUpdate}
          loading={props.getDriverMetaLoading}
          onChange={props.databaseTypeChange}
        >
          {props.generateDriverSelectOptions?.()}
        </BasicSelect>
      </FormItemLabel>
      <FormItemLabel
        className="has-required-style"
        label={t('dmsDataSource.dataSourceForm.ip')}
        name="ip"
        rules={[
          {
            required: true,
            message: t('common.form.rule.require', {
              name: t('dmsDataSource.dataSourceForm.ip')
            })
          }
        ]}
      >
        <BasicInput
          placeholder={t('common.form.placeholder.input', {
            name: t('dmsDataSource.dataSourceForm.ipTips')
          })}
        />
      </FormItemLabel>
      <FormItemLabel
        className="has-required-style"
        label={t('dmsDataSource.dataSourceForm.port')}
        initialValue={3306}
        name="port"
        rules={[
          {
            required: true,
            message: t('common.form.rule.require', {
              name: t('dmsDataSource.dataSourceForm.port')
            })
          },
          {
            validator: validatorPort()
          }
        ]}
      >
        <BasicInput
          placeholder={t('common.form.placeholder.input', {
            name: t('dmsDataSource.dataSourceForm.port')
          })}
        />
      </FormItemLabel>
      <FormItemLabel
        className="has-required-style"
        label={t('dmsDataSource.dataSourceForm.user')}
        name="user"
        rules={[
          {
            required: true,
            message: t('common.form.rule.require', {
              name: t('dmsDataSource.dataSourceForm.user')
            })
          }
        ]}
      >
        <BasicInput
          placeholder={t('common.form.placeholder.input', {
            name: t('dmsDataSource.dataSourceForm.user')
          })}
        />
      </FormItemLabel>
      <EmptyBox if={props.isUpdate}>
        <FormItemLabel
          label={t('dmsDataSource.dataSourceForm.needUpdatePassword')}
          name="needUpdatePassword"
          valuePropName="checked"
        >
          <BasicSwitch
            checked={needUpdatePassword}
            onChange={changeNeedUpdatePassword}
          />
        </FormItemLabel>
      </EmptyBox>
      <FormItemLabel
        className="has-required-style"
        label={
          props.isUpdate
            ? t('dmsDataSource.dataSourceForm.updatePassword')
            : t('dmsDataSource.dataSourceForm.password')
        }
        name="password"
        rules={[
          {
            required: (props.isUpdate && needUpdatePassword) || !props.isUpdate,
            message: t('common.form.rule.require', {
              name: t('dmsDataSource.dataSourceForm.password')
            })
          }
        ]}
      >
        <BasicInput.Password
          placeholder={t('common.form.placeholder.input', {
            name: t('dmsDataSource.dataSourceForm.password')
          })}
        />
      </FormItemLabel>

      <EmptyBox if={(props.currentAsyncParams?.length ?? 0) > 0}>
        <AutoCreatedFormItemByApi
          params={props.currentAsyncParams ?? []}
          disabled={props.isExternalInstance}
        />
      </EmptyBox>

      <FormItemNoLabel>
        <TestDatabaseConnectButton
          initHide={initHide}
          onClickTestButton={testDatabaseConnect}
          loading={loading}
          connectAble={connectAble}
          connectDisableReason={connectErrorMessage}
        />
      </FormItemNoLabel>
    </>
  );
};

export default DatabaseFormItem;
