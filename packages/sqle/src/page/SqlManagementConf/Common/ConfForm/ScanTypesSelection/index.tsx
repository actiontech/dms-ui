import { useTranslation } from 'react-i18next';
import {
  EmptyDataTipsStyleWrapper,
  ScanTypesSelectorStyleWrapper
} from './style';
import { Form, Spin } from 'antd';
import { useContext, useMemo } from 'react';
import { ConfFormContext } from '../context';
import {
  BasicTypographyEllipsis,
  CustomLabelContent,
  FormItemLabel,
  FormItemSubTitle,
  ToggleTokensOptionsType
} from '@actiontech/shared';
import { ScanTypeParams, SqlManagementConfFormFields } from '../index.type';
import classNames from 'classnames';
import { useRequest } from 'ahooks';
import instance from '@actiontech/shared/lib/api/sqle/service/instance';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import useAsyncParams from '../../../../../components/BackendForm/useAsyncParams';
import { IAuditPlanParamResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { SCAN_TYPE_ALL_OPTION_VALUE } from './index.data';

const ScanTypesSelection: React.FC = () => {
  const { t } = useTranslation();
  const form = Form.useFormInstance<SqlManagementConfFormFields>();
  const { projectName } = useCurrentProject();
  const { generateFormValueByParams } = useAsyncParams();

  const contextValue = useContext(ConfFormContext);

  const instanceType = Form.useWatch('instanceType', form);

  const { scanTypeMetas, selectedScanTypeParams } = useMemo(() => {
    return {
      scanTypeMetas: contextValue?.scanTypeMetas ?? [],
      selectedScanTypeParams: contextValue?.selectedScanTypeParams ?? []
    };
  }, [contextValue?.scanTypeMetas, contextValue?.selectedScanTypeParams]);

  const getScanTypeMetaPending = !!contextValue?.getScanTypeMetaPending;
  const submitLoading = !!contextValue?.submitLoading;
  const defaultValue = useContext(ConfFormContext)?.defaultValue;

  const instanceName = Form.useWatch('instanceName', form);
  const { data: instanceInfo } = useRequest(
    () => {
      return instance
        .getInstanceV2({
          instance_name: instanceName,
          project_name: projectName
        })
        .then((res) => {
          if (
            selectedScanTypeParams.length > 0 &&
            res.data.code === ResponseCode.SUCCESS &&
            !defaultValue
          ) {
            form.setFieldsValue(
              selectedScanTypeParams.reduce<Record<string, ScanTypeParams>>(
                (acc, cur) => ({
                  ...acc,
                  [Object.keys(cur)[0]]: {
                    ruleTemplateName: res.data.data?.rule_template?.name
                  } as ScanTypeParams
                }),
                {}
              )
            );
          }
          return res.data.data;
        });
    },
    {
      ready: !!instanceName,
      refreshDeps: [instanceName]
    }
  );

  const options = useMemo<ToggleTokensOptionsType>(() => {
    const allItem: ToggleTokensOptionsType[0] = {
      label: t('common.all'),
      value: SCAN_TYPE_ALL_OPTION_VALUE,
      onClick(checked) {
        if (checked) {
          form.setFieldsValue({
            scanTypes: [
              SCAN_TYPE_ALL_OPTION_VALUE,
              ...(scanTypeMetas.map((v) => v.audit_plan_type ?? '') ?? [])
            ],
            ...scanTypeMetas.reduce<Record<string, ScanTypeParams>>(
              (acc, cur) => {
                return {
                  ...acc,
                  [cur.audit_plan_type ?? '']: {
                    ruleTemplateName: instanceInfo?.rule_template?.name,
                    ...generateFormValueByParams(cur.audit_plan_params ?? [])
                  } as ScanTypeParams
                };
              },
              {}
            )
          });
        } else {
          form.resetFields([
            'scanTypes',
            ...scanTypeMetas.map((meta) => [
              meta.audit_plan_type ?? '',
              'ruleTemplateName'
            ])
          ]);
        }
      }
    };

    const otherItemClick = (
      checked: boolean,
      scanType: string,
      scanParams: IAuditPlanParamResV1[]
    ) => {
      const selectedTypes: string[] = form.getFieldValue('scanTypes');
      if (checked) {
        form.setFieldsValue({
          [scanType]: {
            ruleTemplateName: instanceInfo?.rule_template?.name,
            ...generateFormValueByParams(scanParams)
          } as ScanTypeParams
        });
      } else if (
        !checked &&
        selectedTypes.includes(SCAN_TYPE_ALL_OPTION_VALUE)
      ) {
        form.setFieldsValue({
          scanTypes: selectedTypes.filter(
            (v) => v !== SCAN_TYPE_ALL_OPTION_VALUE
          ),
          [scanType]: {
            ruleTemplateName: ''
          } as ScanTypeParams
        });
      }
    };
    return [
      allItem,
      ...(scanTypeMetas?.map<ToggleTokensOptionsType[0]>((v) => ({
        label: (
          <BasicTypographyEllipsis
            tooltipsMaxWidth={200}
            copyable={false}
            textCont={v.audit_plan_type_desc ?? ''}
          />
        ),
        value: v.audit_plan_type ?? '',
        onClick: (checked) =>
          otherItemClick(
            checked,
            v.audit_plan_type ?? '',
            v.audit_plan_params ?? []
          )
      })) ?? [])
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, instanceInfo?.rule_template, scanTypeMetas, t]);

  return (
    <Spin spinning={getScanTypeMetaPending}>
      <FormItemSubTitle>
        {t('managementConf.create.scanTypesSelection')}
      </FormItemSubTitle>

      <FormItemLabel
        name="scanTypes"
        className="has-label-tip has-required-style"
        label={
          <CustomLabelContent
            title={t('managementConf.create.scanType')}
            tips={t('managementConf.create.scanTypeTips')}
          />
        }
        rules={[
          {
            validator(rule, value, callback) {
              if (!value || !value?.length) {
                return Promise.reject(
                  t('managementConf.create.scanTypeRequiredMessage')
                );
              }
              return Promise.resolve();
            }
          }
        ]}
      >
        {instanceType ? (
          <ScanTypesSelectorStyleWrapper
            wrap
            className={classNames('scan-types-selector', {
              'scan-type-selector-disabled': submitLoading
            })}
            noStyle
            withCheckbox
            multiple
            options={options}
            disabled={submitLoading}
          />
        ) : (
          <EmptyDataTipsStyleWrapper>
            {t('managementConf.create.emptyScanTypeTips')}
          </EmptyDataTipsStyleWrapper>
        )}
      </FormItemLabel>
    </Spin>
  );
};

export default ScanTypesSelection;
