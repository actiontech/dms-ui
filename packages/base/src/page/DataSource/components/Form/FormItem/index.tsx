import { useBoolean } from 'ahooks';
import { useEffect, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, FormInstance } from 'antd';
import EmitterKey from '../../../../../data/EmitterKey';
import EventEmitter from '../../../../../utils/EventEmitter';
import { DataSourceFormField } from '../index.type';
import {
  BasicCollapseStyleWrapper,
  BasicInput,
  BasicSelect,
  BasicSwitch,
  EmptyBox,
  TestDatabaseConnectButton
} from '@actiontech/dms-kit';
import {
  CustomLabelContent,
  FormItemLabel,
  FormItemNoLabel
} from '@actiontech/dms-kit';
import { validatorPort } from '@actiontech/dms-kit';
import {
  AutoCreatedFormItemByApi,
  BackendFormItemParams
} from '@actiontech/shared';
import { DataSourceFormContext } from '../../../context';
import {
  DEFAULT_REDIS_CONNECTION_MODE,
  isRedisDbType,
  MONGODB_ADVANCED_PARAMS,
  MONGODB_AUTH_MECHANISM_PARAM,
  MONGODB_AUTH_SOURCE_PARAM,
  MONGODB_DIRECT_CONNECTION_PARAM,
  MONGODB_MAIN_PARAMS,
  MONGODB_REPLICA_SET_PARAM,
  MONGODB_SEED_HOSTS_PARAM,
  MONGODB_TLS_PARAM,
  MONGODB_TLS_SKIP_VERIFY_PARAM,
  normalizeMongoSeedHosts,
  validateMongoSeedHosts
} from '../../../tool';

const DatabaseFormItem: React.FC<{
  form: FormInstance<DataSourceFormField>;
  isUpdate?: boolean;
  databaseTypeChange?: (values: string) => void;
  generateDriverSelectOptions?: () => JSX.Element[];
  updateDriverListLoading: boolean;
  currentAsyncParams?: BackendFormItemParams[];
  databaseType?: string;
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
  const isMongoDB = props.databaseType?.toLowerCase() === 'mongodb';
  const mongoTopology = Form.useWatch('mongoTopology', props.form);
  const mongoTlsEnabled = Form.useWatch(
    ['params', MONGODB_TLS_PARAM],
    props.form
  );
  const mongodbAsyncParams = useMemo(() => {
    return props.currentAsyncParams ?? [];
  }, [props.currentAsyncParams]);
  const seedHostsParam = useMemo(() => {
    return mongodbAsyncParams.find(
      (item) => item.key === MONGODB_SEED_HOSTS_PARAM
    );
  }, [mongodbAsyncParams]);
  const replicaSetParam = useMemo(() => {
    return mongodbAsyncParams.find(
      (item) => item.key === MONGODB_REPLICA_SET_PARAM
    );
  }, [mongodbAsyncParams]);

  const mongoParamDescMap = useMemo<Record<string, string>>(
    () => ({
      [MONGODB_AUTH_SOURCE_PARAM]: `${t(
        'dmsDataSource.dataSourceForm.mongoAuthSource'
      )}（${t('dmsDataSource.dataSourceForm.mongoAuthSourceTips')}）`,
      [MONGODB_AUTH_MECHANISM_PARAM]: `${t(
        'dmsDataSource.dataSourceForm.mongoAuthMechanism'
      )}（${t('dmsDataSource.dataSourceForm.mongoAuthMechanismTips')}）`,
      [MONGODB_REPLICA_SET_PARAM]: `${t(
        'dmsDataSource.dataSourceForm.mongoReplicaSet'
      )}（${t('dmsDataSource.dataSourceForm.mongoReplicaSetNameTips')}）`,
      [MONGODB_TLS_PARAM]: `${t(
        'dmsDataSource.dataSourceForm.mongoTlsEnabled'
      )}（${t('dmsDataSource.dataSourceForm.mongoTlsEnabledTips')}）`,
      [MONGODB_TLS_SKIP_VERIFY_PARAM]: `${t(
        'dmsDataSource.dataSourceForm.mongoTlsSkipVerify'
      )}（${t('dmsDataSource.dataSourceForm.mongoTlsSkipVerifyTips')}）`,
      [MONGODB_DIRECT_CONNECTION_PARAM]: `${t(
        'dmsDataSource.dataSourceForm.mongoDirectConnection'
      )}（${t('dmsDataSource.dataSourceForm.mongoDirectConnectionTips')}）`
    }),
    [t]
  );

  const withMongoChineseDesc = (
    items: BackendFormItemParams[]
  ): BackendFormItemParams[] =>
    items.map((item) => {
      const key = item.key ?? '';
      const desc = mongoParamDescMap[key];
      return desc ? { ...item, desc } : item;
    });

  const mongoHandledKeys = useMemo(
    () =>
      new Set<string>([
        ...MONGODB_MAIN_PARAMS,
        ...MONGODB_ADVANCED_PARAMS,
        MONGODB_REPLICA_SET_PARAM,
        MONGODB_SEED_HOSTS_PARAM
      ]),
    []
  );

  const mongoMainParams = useMemo(() => {
    if (!isMongoDB) {
      return [];
    }
    return withMongoChineseDesc(
      mongodbAsyncParams.filter((item) =>
        (MONGODB_MAIN_PARAMS as readonly string[]).includes(item.key ?? '')
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMongoDB, mongodbAsyncParams, mongoParamDescMap]);

  const mongoAdvancedParams = useMemo(() => {
    if (!isMongoDB) {
      return [];
    }
    return withMongoChineseDesc(
      mongodbAsyncParams
        .filter((item) =>
          (MONGODB_ADVANCED_PARAMS as readonly string[]).includes(
            item.key ?? ''
          )
        )
        .map((item) => {
          if (item.key === MONGODB_TLS_SKIP_VERIFY_PARAM) {
            return {
              ...item,
              hidden: !mongoTlsEnabled
            };
          }
          return item;
        })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMongoDB, mongodbAsyncParams, mongoParamDescMap, mongoTlsEnabled]);

  const autoCreatedAsyncParams = useMemo(() => {
    if (!isMongoDB) {
      return mongodbAsyncParams;
    }
    return mongodbAsyncParams.filter(
      (item) => !mongoHandledKeys.has(item.key ?? '')
    );
  }, [isMongoDB, mongodbAsyncParams, mongoHandledKeys]);

  const mergeMongoTopologyParams = (
    topology: DataSourceFormField['mongoTopology'],
    paramsValue: Record<string, string | boolean | undefined>
  ) => {
    const nextParams: Record<string, string | boolean | undefined> = {
      ...paramsValue,
      [MONGODB_SEED_HOSTS_PARAM]:
        topology === 'replicaSet' ? paramsValue[MONGODB_SEED_HOSTS_PARAM] : ''
    };

    if (topology === 'single') {
      nextParams.replica_set = '';
      nextParams.direct_connection = false;
    }
    if (topology === 'replicaSet') {
      nextParams.direct_connection = false;
    }
    if (topology === 'shard') {
      nextParams.replica_set = '';
      nextParams.direct_connection = false;
    }

    return nextParams;
  };
  const changeMongoTopology = (value: string | number) => {
    const nextTopology = value as DataSourceFormField['mongoTopology'];
    const paramsValue = (props.form.getFieldValue('params') ?? {}) as Record<
      string,
      string | boolean | undefined
    >;

    props.form.setFieldsValue({
      mongoTopology: nextTopology,
      params: mergeMongoTopologyParams(nextTopology, paramsValue)
    });
  };
  const formatSeedHosts = () => {
    const paramsValue = (props.form.getFieldValue('params') ?? {}) as Record<
      string,
      string | boolean | undefined
    >;
    const seedHosts = paramsValue[MONGODB_SEED_HOSTS_PARAM];
    if (typeof seedHosts === 'string') {
      props.form.setFieldsValue({
        params: {
          ...paramsValue,
          [MONGODB_SEED_HOSTS_PARAM]: normalizeMongoSeedHosts(seedHosts)
        }
      });
    }
  };
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
  useEffect(() => {
    if (!isMongoDB) {
      return;
    }

    const currentTopology = props.form.getFieldValue('mongoTopology');
    const paramsValue = (props.form.getFieldValue('params') ?? {}) as Record<
      string,
      string | boolean | undefined
    >;
    const seedHosts = paramsValue[MONGODB_SEED_HOSTS_PARAM];
    const replicaSet = paramsValue.replica_set;
    const nextTopology =
      currentTopology ?? (seedHosts || replicaSet ? 'replicaSet' : 'single');

    props.form.setFieldsValue({
      mongoTopology: nextTopology,
      params: mergeMongoTopologyParams(nextTopology, paramsValue)
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMongoDB, props.currentAsyncParams]);

  useEffect(() => {
    if (!isMongoDB || mongoTlsEnabled) {
      return;
    }
    const paramsValue = (props.form.getFieldValue('params') ?? {}) as Record<
      string,
      string | boolean | undefined
    >;
    if (paramsValue[MONGODB_TLS_SKIP_VERIFY_PARAM]) {
      props.form.setFieldsValue({
        params: {
          ...paramsValue,
          [MONGODB_TLS_SKIP_VERIFY_PARAM]: false
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMongoDB, mongoTlsEnabled]);

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

      <EmptyBox if={isMongoDB}>
        <FormItemLabel
          className="has-label-tip"
          label={
            <CustomLabelContent
              title={t('dmsDataSource.dataSourceForm.mongoTopology')}
              tips={t('dmsDataSource.dataSourceForm.mongoTopologyTips')}
            />
          }
          name="mongoTopology"
          initialValue="single"
        >
          <BasicSelect
            options={[
              {
                label: t('dmsDataSource.dataSourceForm.mongoTopologySingle'),
                value: 'single'
              },
              {
                label: t(
                  'dmsDataSource.dataSourceForm.mongoTopologyReplicaSet'
                ),
                value: 'replicaSet'
              },
              {
                label: t('dmsDataSource.dataSourceForm.mongoTopologyShard'),
                value: 'shard'
              }
            ]}
            onChange={changeMongoTopology}
            disabled={props.isExternalInstance}
          />
        </FormItemLabel>
        <FormItemNoLabel>
          <div className="ant-form-item-explain ant-form-item-explain-info">
            {mongoTopology === 'replicaSet'
              ? t('dmsDataSource.dataSourceForm.mongoReplicaSetTips')
              : mongoTopology === 'shard'
              ? t('dmsDataSource.dataSourceForm.mongoShardTips')
              : t('dmsDataSource.dataSourceForm.mongoSingleTips')}
          </div>
        </FormItemNoLabel>
      </EmptyBox>

      <EmptyBox if={isMongoDB && mongoMainParams.length > 0}>
        <AutoCreatedFormItemByApi
          params={mongoMainParams}
          disabled={props.isExternalInstance}
        />
      </EmptyBox>

      <EmptyBox
        if={isMongoDB && mongoTopology === 'replicaSet' && !!replicaSetParam}
      >
        <AutoCreatedFormItemByApi
          params={withMongoChineseDesc(
            replicaSetParam ? [replicaSetParam] : []
          )}
          disabled={props.isExternalInstance}
        />
      </EmptyBox>

      <EmptyBox
        if={isMongoDB && mongoTopology === 'replicaSet' && !!seedHostsParam}
      >
        <FormItemLabel
          className="has-label-tip has-required-style"
          label={
            <CustomLabelContent
              title={t('dmsDataSource.dataSourceForm.mongoSeedHosts')}
              tips={t('dmsDataSource.dataSourceForm.mongoSeedHostsTips')}
            />
          }
          name={['params', MONGODB_SEED_HOSTS_PARAM]}
          rules={[
            {
              required: true,
              message: t('common.form.rule.require', {
                name: t('dmsDataSource.dataSourceForm.mongoSeedHosts')
              })
            },
            {
              validator: (_, value) => {
                if (validateMongoSeedHosts(value)) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(
                    t('dmsDataSource.dataSourceForm.mongoSeedHostsRule')
                  )
                );
              }
            }
          ]}
        >
          <BasicInput.TextArea
            disabled={props.isExternalInstance}
            placeholder={t(
              'dmsDataSource.dataSourceForm.mongoSeedHostsPlaceholder'
            )}
            onBlur={formatSeedHosts}
            autoSize={{ minRows: 2, maxRows: 4 }}
          />
        </FormItemLabel>
      </EmptyBox>

      <EmptyBox if={isMongoDB && mongoAdvancedParams.length > 0}>
        <Form.Item
          labelCol={{ span: 0 }}
          wrapperCol={{ span: 24 }}
          colon={false}
        >
          <BasicCollapseStyleWrapper
            ghost
            defaultActiveKey={[]}
            items={[
              {
                key: 'mongo-advanced',
                label: (
                  <CustomLabelContent
                    title={t(
                      'dmsDataSource.dataSourceForm.mongoAdvancedOptions'
                    )}
                    tips={t(
                      'dmsDataSource.dataSourceForm.mongoAdvancedOptionsTips'
                    )}
                  />
                ),
                children: (
                  <AutoCreatedFormItemByApi
                    params={mongoAdvancedParams}
                    disabled={props.isExternalInstance}
                    isFullLine
                  />
                )
              }
            ]}
          />
        </Form.Item>
      </EmptyBox>

      <EmptyBox if={(autoCreatedAsyncParams?.length ?? 0) > 0}>
        <AutoCreatedFormItemByApi
          params={autoCreatedAsyncParams ?? []}
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
