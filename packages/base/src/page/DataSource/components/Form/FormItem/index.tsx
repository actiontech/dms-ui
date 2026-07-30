import { useBoolean } from 'ahooks';
import { useEffect, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { FormInstance, Space } from 'antd';
import EmitterKey from '../../../../../data/EmitterKey';
import EventEmitter from '../../../../../utils/EventEmitter';
import { DataSourceFormField } from '../index.type';
import {
  BasicButton,
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
import PrivilegeCheckResult from '../PrivilegeCheckResult';
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
    try {
      const isConnectable = await formContext?.onCheckConnectable(
        props.currentAsyncParams
      );
      // S1 §5.2.3：连通 API 失败须打开「数据源连通性测试失败」Modal（返回修改 / 继续提交）
      if (isConnectable === false) {
        EventEmitter.emit(EmitterKey.DMS_Open_DataSource_Connect_Error_Modal);
      }
    } finally {
      setConnectionInfoShow();
    }
  };
  const checkPrivileges = async () => {
    await formContext?.onCheckPrivileges(props.currentAsyncParams);
  };
  useEffect(() => {
    const resetConnectAbleStatus = () => {
      setConnectionInfoHide();
      formContext?.resetPrivilegeResult();
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
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <Space wrap align="start">
            <TestDatabaseConnectButton
              initHide={hideConnectionInfo}
              onClickTestButton={testDatabaseConnect}
              loading={formContext?.loading ?? false}
              connectAble={formContext?.connectAble ?? false}
              connectDisableReason={formContext?.connectErrorMessage}
            />
            <BasicButton
              onClick={checkPrivileges}
              loading={formContext?.privilegeLoading ?? false}
            >
              {t('dmsDataSource.dataSourceForm.checkPrivileges')}
            </BasicButton>
          </Space>
          <PrivilegeCheckResult
            visible={formContext?.privilegeChecked ?? false}
            result={formContext?.privilegeResult ?? null}
          />
        </Space>
      </FormItemNoLabel>
    </>
  );
};
export default DatabaseFormItem;
