import { useBoolean } from 'ahooks';
import { useEffect, useState, useContext, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FormInstance, InputRef } from 'antd';
import EmitterKey from '../../../../../data/EmitterKey';
import EventEmitter from '../../../../../utils/EventEmitter';
import { DataSourceFormField } from '../index.type';
import {
  BasicInput,
  BasicSelect,
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
import {
  EditOutlined,
  RollbackOutlined,
  EyeOutlined,
  EyeInvisibleOutlined
} from '@ant-design/icons';
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

  const PASSWORD_PLACEHOLDER = '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022';

  const [isPasswordEditing, setIsPasswordEditing] = useState(false);
  const passwordInputRef = useRef<InputRef>(null);

  const handleStartEdit = useCallback(() => {
    setIsPasswordEditing(true);
    props.form.setFieldsValue({
      isPasswordEditing: true,
      password: ''
    });
  }, [props.form]);

  const handleCancelEdit = useCallback(() => {
    setIsPasswordEditing(false);
    props.form.setFieldsValue({
      isPasswordEditing: false,
      password: undefined
    });
    props.form.setFields([{ name: 'password', errors: [] }]);
  }, [props.form]);

  useEffect(() => {
    if (isPasswordEditing) {
      setTimeout(() => {
        passwordInputRef.current?.focus();
      }, 0);
    }
  }, [isPasswordEditing]);
  // When isPasswordEditing is false (default state), the password FormItem has
  // no name="password" binding, so form.validateFields in the hook will return
  // password as undefined, which is naturally excluded from the API request.
  // When isPasswordEditing is true, the password FormItem is bound and the
  // user's input will be included in the connectivity test.
  const testDatabaseConnect = useCallback(async () => {
    formContext?.onCheckConnectable(props.currentAsyncParams).finally(() => {
      setConnectionInfoShow();
    });
  }, [props.currentAsyncParams, formContext, setConnectionInfoShow]);
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
      {/* Default state: edit page, not editing password */}
      {props.isUpdate && !isPasswordEditing && (
        <FormItemLabel
          className="has-required-style"
          label={t('dmsDataSource.dataSourceForm.password')}
          rules={[{ required: false }]}
        >
          <BasicInput
            readOnly
            value={PASSWORD_PLACEHOLDER}
            onClick={handleStartEdit}
            suffix={
              <EditOutlined
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartEdit();
                }}
                style={{ cursor: 'pointer', color: '#8c8c8c' }}
              />
            }
          />
        </FormItemLabel>
      )}

      {/* Edit mode: edit page, actively editing password */}
      {props.isUpdate && isPasswordEditing && (
        <FormItemLabel
          className="has-required-style"
          label={t('dmsDataSource.dataSourceForm.password')}
          name="password"
          rules={[
            {
              required: true,
              message: t('common.form.rule.require', {
                name: t('dmsDataSource.dataSourceForm.password')
              })
            }
          ]}
        >
          <BasicInput.Password
            ref={passwordInputRef}
            placeholder={t(
              'dmsDataSource.dataSourceForm.editPasswordPlaceholder'
            )}
            iconRender={(visible: boolean) => (
              <span
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <RollbackOutlined
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancelEdit();
                  }}
                  style={{ cursor: 'pointer', color: '#8c8c8c' }}
                />
                {visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              </span>
            )}
          />
        </FormItemLabel>
      )}

      {/* Create mode: new datasource */}
      {!props.isUpdate && (
        <FormItemLabel
          className="has-required-style"
          label={t('dmsDataSource.dataSourceForm.password')}
          name="password"
          rules={[
            {
              required: true,
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
      )}

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
