import { useTranslation } from 'react-i18next';
import { useContext, useEffect, useMemo } from 'react';

import {
  AuditTypeEnum,
  SQLInfoFormItemProps,
  UploadTypeEnum
} from './index.type';
import { useCurrentProject } from '@actiontech/shared/lib/global';

import {
  FormItemLabel,
  CustomLabelContent
} from '@actiontech/shared/lib/components/CustomForm';

import { Form, Radio, RadioGroupProps, SelectProps, Space } from 'antd';
import { formItemLayout } from '@actiontech/shared/lib/components/CustomForm/style';
import { BasicButton, BasicSelect, BasicToolTip } from '@actiontech/shared';
import DatabaseInfo from './DatabaseInfo';
import useDatabaseType from '../../../../hooks/useDatabaseType';
import useInstance from '../../../../hooks/useInstance';
import SQLStatementForm from '../SQLStatementForm';
import { getInstanceTipListV1FunctionalModuleEnum } from '@actiontech/shared/lib/api/sqle/service/instance/index.enum';
import { FormSubmitStatusContext } from '..';
import {
  FormatLanguageSupport,
  formatterSQL
} from '@actiontech/shared/lib/utils/FormatterSQL';
import { InfoCircleOutlined } from '@actiontech/icons';
import useGlobalRuleTemplate from '../../../../hooks/useGlobalRuleTemplate';
import useRuleTemplate from '../../../../hooks/useRuleTemplate';

const SQLInfoFormItem = ({
  form,
  submit,
  setAuditLoading
}: SQLInfoFormItemProps) => {
  const { t } = useTranslation();
  const { projectName } = useCurrentProject();
  const submitLoading = useContext(FormSubmitStatusContext);

  const auditType = Form.useWatch('auditType', form);
  const uploadType = Form.useWatch('uploadType', form);

  const selectedDbType = Form.useWatch('dbType', form);

  const {
    loading: getDriverMetaLoading,
    updateDriverNameList,
    generateDriverSelectOptions
  } = useDatabaseType();
  const {
    instanceOptions,
    updateInstanceList,
    instanceList,
    loading: instanceLoading
  } = useInstance();

  const {
    loading: getRuleTemplateTipsPending,
    ruleTemplateList,
    updateRuleTemplateList
  } = useRuleTemplate();

  const {
    loading: getGlobalRuleTemplateTipsPending,
    globalRuleTemplateList,
    updateGlobalRuleTemplateList
  } = useGlobalRuleTemplate();

  useEffect(() => {
    if (auditType === AuditTypeEnum.static) {
      updateDriverNameList();
    } else if (auditType === AuditTypeEnum.dynamic) {
      updateInstanceList({
        project_name: projectName,
        functional_module:
          getInstanceTipListV1FunctionalModuleEnum.create_workflow
      });
    }
  }, [projectName, updateDriverNameList, updateInstanceList, auditType]);

  useEffect(() => {
    if (selectedDbType) {
      updateRuleTemplateList(projectName, selectedDbType);
      updateGlobalRuleTemplateList(selectedDbType);
    }
  }, [
    selectedDbType,
    projectName,
    updateGlobalRuleTemplateList,
    updateRuleTemplateList
  ]);

  const auditTypeChange: RadioGroupProps['onChange'] = () => {
    form.setFieldsValue({
      instanceName: undefined
    });
  };

  const formatSql = async () => {
    const values = await form.getFieldsValue();
    const dbType =
      auditType === AuditTypeEnum.dynamic
        ? instanceList.find((v) => v.instance_name === values.instanceName)
            ?.instance_type
        : values.dbType;
    const sql = formatterSQL(values.sql, dbType);
    form.setFieldsValue({
      sql
    });
  };

  const internalSubmit = async () => {
    const params = await form.validateFields();
    setAuditLoading(true);
    submit(params).finally(() => {
      setAuditLoading(false);
    });
  };

  const ruleTemplateOptions: SelectProps['options'] = useMemo(() => {
    return [...ruleTemplateList, ...globalRuleTemplateList].map((item) => {
      return {
        label: item.rule_template_name,
        value: item.rule_template_name
      };
    });
  }, [globalRuleTemplateList, ruleTemplateList]);

  return (
    <>
      <FormItemLabel
        className="has-required-style has-label-tip"
        name="auditType"
        label={
          <CustomLabelContent
            title={t('sqlAudit.create.sqlInfo.form.auditType')}
            tips={t('sqlAudit.create.sqlInfo.form.auditTypeDesc')}
          />
        }
        {...formItemLayout.spaceBetween}
        rules={[
          {
            required: true
          }
        ]}
        initialValue={AuditTypeEnum.dynamic}
      >
        <Radio.Group onChange={auditTypeChange} disabled={submitLoading}>
          <Radio value={AuditTypeEnum.static}>
            {t('sqlAudit.create.sqlInfo.form.staticAudit')}
          </Radio>
          <Radio value={AuditTypeEnum.dynamic}>
            {t('sqlAudit.create.sqlInfo.form.dynamicAudit')}
          </Radio>
        </Radio.Group>
      </FormItemLabel>
      <FormItemLabel
        hidden={auditType === AuditTypeEnum.dynamic}
        className="has-required-style"
        name="dbType"
        label={t('sqlAudit.create.sqlInfo.form.dbType')}
        rules={[
          {
            required: auditType !== AuditTypeEnum.dynamic
          }
        ]}
        {...formItemLayout.spaceBetween}
      >
        <BasicSelect loading={getDriverMetaLoading} disabled={submitLoading}>
          {generateDriverSelectOptions()}
        </BasicSelect>
      </FormItemLabel>
      <DatabaseInfo
        form={form}
        auditType={auditType}
        instanceLoading={instanceLoading}
        instanceOptions={instanceOptions}
      />
      <FormItemLabel
        className="has-required-style has-label-tip"
        rules={[{ required: auditType !== AuditTypeEnum.dynamic }]}
        name="ruleTemplate"
        hidden={auditType === AuditTypeEnum.dynamic}
        label={
          <CustomLabelContent
            title={t('sqlAudit.create.sqlInfo.form.ruleTemplate')}
            tips={t('sqlAudit.create.sqlInfo.form.ruleTemplateDesc')}
          />
        }
        {...formItemLayout.spaceBetween}
      >
        <BasicSelect
          loading={
            getGlobalRuleTemplateTipsPending || getRuleTemplateTipsPending
          }
          disabled={submitLoading || !selectedDbType}
          options={ruleTemplateOptions}
        />
      </FormItemLabel>
      <SQLStatementForm form={form} />
      <Space size={12}>
        <BasicButton
          onClick={internalSubmit}
          type="primary"
          loading={submitLoading}
        >
          {t('sqlAudit.create.sqlInfo.audit')}
        </BasicButton>
        <Space hidden={uploadType !== UploadTypeEnum.sql}>
          <BasicButton onClick={formatSql} loading={submitLoading}>
            {t('sqlAudit.create.sqlInfo.format')}
          </BasicButton>
          <BasicToolTip
            prefixIcon={<InfoCircleOutlined />}
            title={t('sqlAudit.create.sqlInfo.formatTips', {
              supportType: Object.keys(FormatLanguageSupport).join('、')
            })}
          />
        </Space>
      </Space>
    </>
  );
};

export default SQLInfoFormItem;
