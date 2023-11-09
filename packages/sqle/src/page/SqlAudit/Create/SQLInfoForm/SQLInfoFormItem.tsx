import { useTranslation } from 'react-i18next';
import { useContext, useEffect } from 'react';

import {
  AuditTypeEnum,
  SQLInfoFormItemProps,
  UploadTypeEnum
} from './index.type';
import { useCurrentProject } from '@actiontech/shared/lib/global';

import { FormItemLabel } from '@actiontech/shared/lib/components/FormCom';

import { Form, Radio, RadioGroupProps, Space } from 'antd5';
import { formItemLayout } from '@actiontech/shared/lib/components/FormCom/style';
import { BasicButton, BasicSelect, BasicToolTips } from '@actiontech/shared';
import DatabaseInfo from './DatabaseInfo';
import useDatabaseType from '../../../../hooks/useDatabaseType';
import useInstance from '../../../../hooks/useInstance';
import SQLStatementForm from '../SQLStatementForm';
import { IconTipGray } from '@actiontech/shared/lib/Icon';
import {
  FormatLanguageSupport,
  formatterSQL
} from '../../../../utils/FormatterSQL';
import { getInstanceTipListV1FunctionalModuleEnum } from '@actiontech/shared/lib/api/sqle/service/instance/index.enum';
import { FormSubmitStatusContext } from '..';

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

  return (
    <>
      <FormItemLabel
        className="has-required-style"
        name="auditType"
        label={t('sqlAudit.create.sqlInfo.form.auditType')}
        {...formItemLayout.spaceBetween}
        required={true}
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
      <SQLStatementForm form={form} />
      <Space size={12}>
        <BasicButton
          onClick={internalSubmit}
          type="primary"
          loading={submitLoading}
        >
          {t('order.sqlInfo.audit')}
        </BasicButton>
        <Space hidden={uploadType !== UploadTypeEnum.sql}>
          <BasicButton onClick={formatSql} loading={submitLoading}>
            {t('order.sqlInfo.format')}
          </BasicButton>
          <BasicToolTips
            prefixIcon={<IconTipGray />}
            title={t('order.sqlInfo.formatTips', {
              supportType: Object.keys(FormatLanguageSupport).join('、')
            })}
          />
        </Space>
      </Space>
    </>
  );
};

export default SQLInfoFormItem;
