import { useBoolean } from 'ahooks';
import { useEffect, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, FormInstance } from 'antd';
import EmitterKey from '../../../../../data/EmitterKey';
import EventEmitter from '../../../../../utils/EventEmitter';
import { DataSourceFormField } from '../index.type';
import {
  BasicInput,
  BasicSelect,
  BasicSwitch,
  EmptyBox,
  TestDatabaseConnectButton
} from '@actiontech/dms-kit';
import { FormItemLabel, FormItemNoLabel } from '@actiontech/dms-kit';
import { validatorPort } from '@actiontech/dms-kit';
import {
  AutoCreatedFormItemByApi,
  BackendFormItemParams
} from '@actiontech/shared';
import { DataSourceFormContext } from '../../../context';
import { DEFAULT_REDIS_CONNECTION_MODE, isRedisDbType } from '../../../tool';
const DatabaseFormItem: React.FC<{
  form: FormInstance<DataSourceFormField>;
  isUpdate?: boolean;
  databaseTypeChange?: (values: string) => void;
  generateDriverSelectOptions?: () => JSX.Element[];
  updateDriverListLoading: boolean;
  currentAsyncParams?: BackendFormItemParams[];
  isExternalInstance?: boolean;
}> = (props) => {
  const { t } = useTranslation();
  const formContext = useContext(DataSourceFormContext);
  const databaseType = Form.useWatch('type', props.form);
  const connectionMode = Form.useWatch('connectionMode', props.form);
  const isRedis = isRedisDbType(databaseType);
  const [
    hideConnectionInfo,
    { setFalse: setConnectionInfoShow, setTrue: setConnectionInfoHide }
  ] = useBoolean(true);
  const [needUpdatePassword, setNeedUpdatePassword] = useState(false);
  const changeNeedUpdatePassword = (check: boolean) => {
    setNeedUpdatePassword(check);
    props.form.setFieldsValue({
      needUpdatePassword: check
    });
  };
  const testDatabaseConnect = async () => {
    formContext?.onCheckConnectable(props.currentAsyncParams).finally(() => {
      setConnectionInfoShow();
    });
  };
  useEffect(() => {
    const resetConnectAbleStatus = () => {
      setConnectionInfoHide();
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
          loading={props.updateDriverListLoading}
          onChange={props.databaseTypeChange}
        >
          {props.generateDriverSelectOptions?.()}
        </BasicSelect>
      </FormItemLabel>
      <EmptyBox if={isRedis}>
        <FormItemLabel
          className="has-required-style"
          label={t('dmsDataSource.dataSourceForm.connectionMode')}
          name="connectionMode"
          initialValue={DEFAULT_REDIS_CONNECTION_MODE}
          rules={[
            {
              required: true,
              message: t('common.form.rule.require', {
                name: t('dmsDataSource.dataSourceForm.connectionMode')
              })
            }
          ]}
        >
          <BasicSelect
            options={[
              {
                label: t(
                  'dmsDataSource.dataSourceForm.connectionModeStandalone'
                ),
                value: 'standalone'
              },
              {
                label: t('dmsDataSource.dataSourceForm.connectionModeCluster'),
                value: 'cluster'
              }
            ]}
          />
        </FormItemLabel>
      </EmptyBox>
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
        validateFirst
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
        className={connectionMode === 'cluster' ? '' : 'has-required-style'}
        label={t('dmsDataSource.dataSourceForm.user')}
        name="user"
        rules={[
          {
            required: connectionMode !== 'cluster',
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
        className={
          props.isUpdate && needUpdatePassword ? 'has-required-style' : ''
        }
        label={
          props.isUpdate
            ? t('dmsDataSource.dataSourceForm.updatePassword')
            : t('dmsDataSource.dataSourceForm.password')
        }
        name="password"
        rules={[
          {
            // S1 §22.2: add-mode empty password must pass validation (gbase8a_local)
            required: props.isUpdate && needUpdatePassword,
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
          initHide={hideConnectionInfo}
          onClickTestButton={testDatabaseConnect}
          loading={formContext?.loading ?? false}
          connectAble={formContext?.connectAble ?? false}
          connectDisableReason={formContext?.connectErrorMessage}
        />
      </FormItemNoLabel>
    </>
  );
};
export default DatabaseFormItem;
