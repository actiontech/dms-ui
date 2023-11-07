import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

import {
  AuditTypeEnum,
  SQLInfoFormItemProps,
  UploadTypeEnum
} from './index.type';
import { useCurrentProject } from '@actiontech/shared/lib/global';

import {
  FormItemLabel,
  FormItemNoLabel
} from '@actiontech/shared/lib/components/FormCom';

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

const SQLInfoFormItem = ({ form, submit }: SQLInfoFormItemProps) => {
  const { t } = useTranslation();
  const { projectName } = useCurrentProject();

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
    submit(params);
  };

  return (
    <>
      {/* 审核方式 */}
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
        <Radio.Group onChange={auditTypeChange}>
          <Radio value={AuditTypeEnum.static}>
            {t('sqlAudit.create.sqlInfo.form.staticAudit')}
          </Radio>
          <Radio value={AuditTypeEnum.dynamic}>
            {t('sqlAudit.create.sqlInfo.form.dynamicAudit')}
          </Radio>
        </Radio.Group>
      </FormItemLabel>
      {/* 数据库类型 */}
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
        <BasicSelect loading={getDriverMetaLoading}>
          {generateDriverSelectOptions()}
        </BasicSelect>
      </FormItemLabel>
      {/* 数据源 ｜ 数据库 */}
      <DatabaseInfo
        form={form}
        auditType={auditType}
        instanceLoading={instanceLoading}
        instanceOptions={instanceOptions}
      />
      {/* sql语句 */}
      <SQLStatementForm form={form} />
      {/* 按钮 */}
      <FormItemNoLabel>
        <Space size={12}>
          <BasicButton
            onClick={internalSubmit}
            type="primary"
            // loading={auditLoading}
          >
            {t('order.sqlInfo.audit')}
          </BasicButton>
          <Space hidden={uploadType !== UploadTypeEnum.sql}>
            <BasicButton
              onClick={formatSql}
              // loading={auditLoading}
            >
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
      </FormItemNoLabel>
    </>
  );
};

export default SQLInfoFormItem;
