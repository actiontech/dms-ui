import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useBoolean, useRequest } from 'ahooks';
import useHideConfigInputNode from '../../../../../shared/lib/components/ConfigItem/hooks/useHideConfigInputNode';
import configuration from '@actiontech/shared/lib/api/sqle/service/configuration';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { IUpdateSystemVariablesReqV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { ConfigFieldMapMeta } from '@actiontech/shared/lib/components/ConfigItem/index.type';
import { Spin } from 'antd';
import SystemBasicTitle from '../components/BasicTitle';
import OrderExpiredHours from './components/OrderExpiredHours';
import OperationRecordExpiredHours from './components/OperationRecordExpiredHours';
import UrlAddressPrefixTips from './components/UrlAddressPrefixTips';
import CBOperationLogsExpiredHours from './components/CBOperationLogsExpiredHours';
import { useCurrentUser } from '@actiontech/shared/lib/global';

const GlobalSetting = () => {
  const { t } = useTranslation();

  const { isAdmin } = useCurrentUser();

  const [
    orderExpiredHoursFieldVisible,
    {
      setTrue: showOrderExpiredHoursField,
      setFalse: hideOrderExpiredHoursField
    }
  ] = useBoolean();
  const [
    operationRecordExpiredHoursField,
    {
      setTrue: showOperationRecordExpiredHoursField,
      setFalse: hideOperationRecordExpiredHoursField
    }
  ] = useBoolean();

  const [
    cbOperationLogsExpiredHoursField,
    {
      setTrue: showCBOperationLogsExpiredHoursField,
      setFalse: hideCBOperationLogsExpiredHoursField
    }
  ] = useBoolean();

  const [urlFieldVisible, { setTrue: showUrlField, setFalse: hideUrlField }] =
    useBoolean();

  const hideFieldsAction = () => {
    if (orderExpiredHoursFieldVisible) hideOrderExpiredHoursField();
    if (operationRecordExpiredHoursField)
      hideOperationRecordExpiredHoursField();
    if (cbOperationLogsExpiredHoursField)
      hideCBOperationLogsExpiredHoursField();
    if (urlFieldVisible) hideUrlField();
  };

  const hasOneFieldVisible = useMemo(
    () =>
      orderExpiredHoursFieldVisible ||
      operationRecordExpiredHoursField ||
      urlFieldVisible,
    [
      orderExpiredHoursFieldVisible,
      operationRecordExpiredHoursField,
      urlFieldVisible
    ]
  );

  useHideConfigInputNode(hasOneFieldVisible, hideFieldsAction);

  const fieldMetaMap = new Map<
    keyof IUpdateSystemVariablesReqV1,
    ConfigFieldMapMeta
  >([
    [
      'workflow_expired_hours',
      {
        hideField: hideOrderExpiredHoursField
      }
    ],
    [
      'operation_record_expired_hours',
      {
        hideField: hideOperationRecordExpiredHoursField
      }
    ],
    [
      'cb_operation_logs_expired_hours',
      {
        hideField: hideCBOperationLogsExpiredHoursField
      }
    ],
    [
      'url',
      {
        hideField: hideUrlField
      }
    ]
  ]);

  const {
    data: globalConfig,
    loading: getConfigLoading,
    refresh
  } = useRequest(() =>
    configuration.getSystemVariablesV1().then((res) => res?.data?.data ?? {})
  );

  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();

  const submitGlobalConfig = (
    value: string | number,
    fieldName: keyof IUpdateSystemVariablesReqV1
  ) => {
    const fieldMeta = fieldMetaMap.get(fieldName);

    startSubmit();
    configuration
      .updateSystemVariablesV1({
        ...globalConfig,
        [fieldName]: value
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          refresh();
          fieldMeta?.hideField?.();
        }
      })
      .finally(() => {
        submitFinish();
      });
  };

  return (
    <SystemBasicTitle title={t('dmsSystem.tabPaneTitle.globalConfiguration')}>
      <>
        <Spin spinning={getConfigLoading || submitLoading}>
          {/* main 分支中已删除该组件 */}
          <OrderExpiredHours
            expiredHours={globalConfig?.workflow_expired_hours}
            fieldVisible={orderExpiredHoursFieldVisible}
            showField={showOrderExpiredHoursField}
            hideField={hideOrderExpiredHoursField}
            submitGlobalConfig={submitGlobalConfig}
            isAdmin={isAdmin}
          />
          <OperationRecordExpiredHours
            expiredHours={globalConfig?.operation_record_expired_hours}
            fieldVisible={operationRecordExpiredHoursField}
            showField={showOperationRecordExpiredHoursField}
            hideField={hideOperationRecordExpiredHoursField}
            submitGlobalConfig={submitGlobalConfig}
          />
          <CBOperationLogsExpiredHours
            expiredHours={globalConfig?.cb_operation_logs_expired_hours}
            fieldVisible={cbOperationLogsExpiredHoursField}
            showField={showCBOperationLogsExpiredHoursField}
            hideField={hideCBOperationLogsExpiredHoursField}
            submitGlobalConfig={submitGlobalConfig}
          />
          <UrlAddressPrefixTips
            url={globalConfig?.url}
            fieldVisible={urlFieldVisible}
            showField={showUrlField}
            hideField={hideUrlField}
            submitGlobalConfig={submitGlobalConfig}
          />
        </Spin>
      </>
    </SystemBasicTitle>
  );
};

export default GlobalSetting;
