import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useBoolean, useRequest } from 'ahooks';
import { Spin, message } from 'antd5';
import { ConfigItem } from '@actiontech/shared';
import configuration from '@actiontech/shared/lib/api/sqle/service/configuration';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import {
  EditInput,
  EditInputNumber,
  LabelContent
} from '@actiontech/shared/lib/components/ConfigItem';
import { IUpdateSystemVariablesReqV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { integerValidate } from '@actiontech/shared/lib/utils/Common';
import useHideConfigInputNode from '../../../../../shared/lib/components/ConfigItem/hooks/useHideConfigInputNode';
import { ConfigFieldMapMeta } from '@actiontech/shared/lib/components/ConfigItem/index.type';

const GlobalSetting = () => {
  const { t } = useTranslation();
  const [messageApi, messageContextHolder] = message.useMessage();
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
  const [urlFieldVisible, { setTrue: showUrlField, setFalse: hideUrlField }] =
    useBoolean();
  const hideFieldsAction = () => {
    if (orderExpiredHoursFieldVisible) hideOrderExpiredHoursField();
    if (operationRecordExpiredHoursField)
      hideOperationRecordExpiredHoursField();
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

  const integerValidator = (value: string) => {
    if (!integerValidate(value)) {
      messageApi.error(t('common.form.rule.integer'));
      return false;
    }
    return true;
  };

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
    <section className="system-form-wrapper">
      <div className="config-title-wrapper has-border">
        {t('dmsSystem.tabPaneTitle.globalConfiguration')}
      </div>
      <Spin spinning={getConfigLoading || submitLoading}>
        {messageContextHolder}
        <ConfigItem
          label={
            <LabelContent>{`${t('dmsSystem.global.orderExpiredHours')}(${t(
              'common.time.hour'
            )})`}</LabelContent>
          }
          descNode={String(globalConfig?.workflow_expired_hours ?? '-')}
          fieldVisible={orderExpiredHoursFieldVisible}
          showField={showOrderExpiredHoursField}
          hideField={hideOrderExpiredHoursField}
          inputNode={
            <EditInputNumber
              fieldValue={globalConfig?.workflow_expired_hours ?? 2160}
              validator={(value: number) => integerValidator(String(value))}
              hideField={hideOrderExpiredHoursField}
              onSubmit={(value: number) => {
                submitGlobalConfig(value, 'workflow_expired_hours');
              }}
            />
          }
        />
        <ConfigItem
          label={
            <LabelContent>{`${t(
              'dmsSystem.global.operationRecordExpiredHours'
            )}(${t('common.time.hour')})`}</LabelContent>
          }
          descNode={String(globalConfig?.operation_record_expired_hours ?? '-')}
          fieldVisible={operationRecordExpiredHoursField}
          showField={showOperationRecordExpiredHoursField}
          hideField={hideOperationRecordExpiredHoursField}
          inputNode={
            <EditInputNumber
              fieldValue={globalConfig?.operation_record_expired_hours ?? 2160}
              validator={(value: number) => integerValidator(String(value))}
              hideField={hideOperationRecordExpiredHoursField}
              onSubmit={(value: number) => {
                submitGlobalConfig(value, 'operation_record_expired_hours');
              }}
            />
          }
        />
        <ConfigItem
          label={
            <LabelContent
              tips={`${t('dmsSystem.global.urlAddressPrefixTips')}, ${t(
                'dmsSystem.global.urlAddressFormatTips'
              )} `}
            >
              {t('dmsSystem.global.urlAddressPrefix')}
            </LabelContent>
          }
          descNode={!!globalConfig?.url ? globalConfig.url : '-'}
          fieldVisible={urlFieldVisible}
          showField={showUrlField}
          hideField={hideUrlField}
          inputNode={
            <EditInput
              fieldValue={globalConfig?.url ?? ''}
              hideField={hideUrlField}
              onSubmit={(value: string) => {
                submitGlobalConfig(value, 'url');
              }}
            />
          }
        />
      </Spin>
    </section>
  );
};

export default GlobalSetting;
