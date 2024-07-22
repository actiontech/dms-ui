import {
  CustomLabelContent,
  FormItemLabel,
  FormItemSubTitle
} from '@actiontech/shared/lib/components/FormCom';
import { useTranslation } from 'react-i18next';
import {
  EmptyDataTipsStyleWrapper,
  ScanTypesSelectorStyleWrapper
} from './style';
import { Form, Spin } from 'antd';
import { ToggleTokensOptionsType } from '@actiontech/shared/lib/components/ToggleTokens/index.type';
import { useContext, useEffect, useMemo } from 'react';
import { ConfFormContext } from '../context';
import { BasicTypographyEllipsis } from '@actiontech/shared';
import { SqlManagementConfFormFields } from '../index.type';
import classNames from 'classnames';

const SCAN_TYPE_ALL_OPTION_VALUE = 'all';

const ScanTypesSelection: React.FC = () => {
  const { t } = useTranslation();
  const form = Form.useFormInstance<SqlManagementConfFormFields>();

  const contextValue = useContext(ConfFormContext);

  const instanceType = Form.useWatch('instanceType', form);

  const scanTypeMetas = useMemo(
    () => contextValue?.scanTypeMetas ?? [],
    [contextValue?.scanTypeMetas]
  );

  const getScanTypeMetaPending = !!contextValue?.getScanTypeMetaPending;
  const submitLoading = !!contextValue?.submitLoading;

  const options = useMemo<ToggleTokensOptionsType>(() => {
    const allItem: ToggleTokensOptionsType[0] = {
      label: t('common.all'),
      value: SCAN_TYPE_ALL_OPTION_VALUE,
      onClick(checked) {
        const allValues = scanTypeMetas?.map((v) => v.audit_plan_type) ?? [];
        if (checked) {
          form.setFieldValue('scanTypes', [
            SCAN_TYPE_ALL_OPTION_VALUE,
            ...allValues
          ]);
        } else {
          form.setFieldValue('scanTypes', []);
        }
      }
    };

    const otherItemClick = (checked: boolean) => {
      const selectedTypes: string[] = form.getFieldValue('scanTypes');
      if (!checked && selectedTypes.includes(SCAN_TYPE_ALL_OPTION_VALUE)) {
        form.setFieldValue(
          'scanTypes',
          selectedTypes.filter((v) => v !== SCAN_TYPE_ALL_OPTION_VALUE)
        );
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
        onClick: otherItemClick
      })) ?? [])
    ];
  }, [form, scanTypeMetas, t]);

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
