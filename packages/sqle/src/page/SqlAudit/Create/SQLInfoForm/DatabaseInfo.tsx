import { useTranslation } from 'react-i18next';

import { AuditTypeEnum, DatabaseInfoProps } from './index.type';

import {
  FormItemLabel,
  FormItemNoLabel
} from '@actiontech/shared/lib/components/FormCom';
import { useCallback, useContext, useMemo, useState } from 'react';
import { Form, Space } from 'antd5';
import { CustomSelect } from '@actiontech/shared/lib/components/CustomSelect';
import {
  IconDatabase,
  IconDatabaseActive,
  IconDatabaseSchema,
  IconDatabaseSchemaActive,
  IconFillList,
  IconFillListActive
} from '@actiontech/shared/lib/Icon/common';
import useInstanceSchema from '../../../../hooks/useInstanceSchema';
import { IInstanceResV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import instance from '@actiontech/shared/lib/api/sqle/service/instance';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { BasicButton, BasicToolTips } from '@actiontech/shared';
import { Link } from 'react-router-dom';
import { FormSubmitStatusContext } from '..';

const DatabaseInfo = ({
  form,
  auditType,
  instanceLoading,
  instanceOptions
}: DatabaseInfoProps) => {
  const { t } = useTranslation();
  const { projectID, projectName } = useCurrentProject();
  const submitLoading = useContext(FormSubmitStatusContext);

  const isDynamic = useMemo(
    () => auditType === AuditTypeEnum.dynamic,
    [auditType]
  );
  const [instanceInfo, setInstanceInfo] = useState<IInstanceResV2>();
  const instanceName = Form.useWatch('instanceName', form);
  const { loading: getInstanceSchemaListLoading, schemaList } =
    useInstanceSchema(projectName, instanceName);

  const updateRuleTemplateName = (name: string) => {
    if (!name) {
      setInstanceInfo(undefined);
    }
    instance
      .getInstanceV2({ instance_name: name, project_name: projectName })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setInstanceInfo(res.data.data);
        }
      });
  };

  const handleInstanceNameChange = (name: string) => {
    form.setFieldsValue({ instanceSchema: undefined });
    updateRuleTemplateName(name);
  };

  const renderRuleTemplateDisplay = useCallback(() => {
    if (!instanceInfo || !instanceInfo.rule_template) {
      return (
        <BasicButton style={{ width: 36, height: 36 }}>
          <IconFillList />
        </BasicButton>
      );
    }

    const path = instanceInfo.rule_template?.is_global_rule_template
      ? `/sqle/ruleManager/globalDetail/${instanceInfo.rule_template.name}/${instanceInfo.db_type}`
      : `/sqle/project/${projectID}/rule/template/detail/${instanceInfo.rule_template.name}/${instanceInfo.db_type}`;

    return (
      <BasicToolTips
        title={
          <Link to={path}>
            {t('rule.form.ruleTemplate')}: {instanceInfo.rule_template.name}
          </Link>
        }
      >
        <BasicButton style={{ width: 36, height: 36 }}>
          <IconFillListActive />
        </BasicButton>
      </BasicToolTips>
    );
  }, [instanceInfo, projectID, t]);

  return (
    <div hidden={!isDynamic}>
      <FormItemLabel
        label={t('sqlAudit.create.sqlInfo.form.instanceName')}
        className="has-required-style"
        style={{ marginBottom: 16 }}
        required={auditType !== AuditTypeEnum.static}
      />
      <Space align="start" size={12}>
        <FormItemNoLabel
          name="instanceName"
          rules={[
            {
              required: isDynamic,
              message: t('common.form.placeholder.select', {
                name: t('sqlAudit.create.sqlInfo.form.instanceName')
              })
            }
          ]}
        >
          <CustomSelect
            className="data-source-row-select"
            allowClear={false}
            prefix={<IconDatabase />}
            valuePrefix={<IconDatabaseActive />}
            size="middle"
            disabled={submitLoading}
            loading={instanceLoading}
            options={instanceOptions}
            onChange={(value) => handleInstanceNameChange(value)}
          />
        </FormItemNoLabel>
        <FormItemNoLabel
          name="instanceSchema"
          rules={[
            {
              required: isDynamic,
              message: t('common.form.placeholder.select', {
                name: t('sqlAudit.create.sqlInfo.form.instanceSchema')
              })
            }
          ]}
        >
          <CustomSelect
            className="data-source-row-select"
            size="middle"
            disabled={submitLoading || !instanceName}
            prefix={<IconDatabaseSchema />}
            valuePrefix={<IconDatabaseSchemaActive />}
            loading={getInstanceSchemaListLoading}
            placeholder={t('common.form.placeholder.select', {
              name: t('sqlAudit.create.sqlInfo.form.instanceSchema')
            })}
            options={schemaList.map((item) => ({
              label: item,
              value: item
            }))}
          />
        </FormItemNoLabel>
        {renderRuleTemplateDisplay()}
      </Space>
    </div>
  );
};

export default DatabaseInfo;
