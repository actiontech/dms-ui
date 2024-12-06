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
import OperationRecordExpiredHours from './components/OperationRecordExpiredHours';
import UrlAddressPrefixTips from './components/UrlAddressPrefixTips';

const GlobalSetting = () => {
  const { t } = useTranslation();

  const [
    operationRecordExpiredHoursField,
    {
      setTrue: showOperationRecordExpiredHoursField,
      setFalse: hideOperationRecordExpiredHoursField
    }
  ] = useBoolean();
  const [urlFieldVisible, { setTrue: showUrlField, setFalse: hideUrlField }] =
    useBoolean();

  const hideFieldsAction = () => {
    if (operationRecordExpiredHoursField)
      hideOperationRecordExpiredHoursField();
    if (urlFieldVisible) hideUrlField();
  };

  const hasOneFieldVisible = useMemo(
    () => operationRecordExpiredHoursField || urlFieldVisible,
    [operationRecordExpiredHoursField, urlFieldVisible]
  );

  useHideConfigInputNode(hasOneFieldVisible, hideFieldsAction);

  const fieldMetaMap = new Map<
    keyof IUpdateSystemVariablesReqV1,
    ConfigFieldMapMeta
  >([
    [
      'operation_record_expired_hours',
      {
        hideField: hideOperationRecordExpiredHoursField
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
          <OperationRecordExpiredHours
            expiredHours={globalConfig?.operation_record_expired_hours}
            fieldVisible={operationRecordExpiredHoursField}
            showField={showOperationRecordExpiredHoursField}
            hideField={hideOperationRecordExpiredHoursField}
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
