import { useTranslation } from 'react-i18next';
import { DatabaseInfoProps } from '../../index.type';
import {
  FormItemLabel,
  FormItemNoLabel
} from '@actiontech/shared/lib/components/FormCom';
import { useCallback, useContext, useState } from 'react';
import { Alert, Form, Space } from 'antd';
import { CustomSelect } from '@actiontech/shared/lib/components/CustomSelect';
import useInstanceSchema from '../../../../hooks/useInstanceSchema';
import { IInstanceResV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import instance from '@actiontech/shared/lib/api/sqle/service/instance';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { BasicButton, BasicToolTips } from '@actiontech/shared';
import { Link } from 'react-router-dom';
import { FormSubmitStatusContext } from '..';
import {
  DatabaseSchemaFilled,
  DatabaseFilled,
  ProfileSquareFilled
} from '@actiontech/icons';
import useThemeStyleData from '../../../../hooks/useThemeStyleData';
import { CommonIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';

const DatabaseInfo: React.FC<DatabaseInfoProps> = ({
  form,
  instanceLoading,
  instanceOptions
}) => {
  const { t } = useTranslation();
  const { projectID, projectName } = useCurrentProject();
  const { sqleTheme } = useThemeStyleData();
  const submitLoading = useContext(FormSubmitStatusContext);

  const [instanceInfo, setInstanceInfo] = useState<IInstanceResV2>();
  const instanceName = Form.useWatch('instanceName', form);
  const { loading: getInstanceSchemaListLoading, schemaList } =
    useInstanceSchema(projectName, instanceName);

  const updateRuleTemplateName = (name: string) => {
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
        <BasicButton
          style={{ width: 36, height: 36 }}
          icon={<ProfileSquareFilled width={18} height={18} />}
        />
      );
    }

    const path = instanceInfo.rule_template?.is_global_rule_template
      ? `/sqle/rule-manager/global-detail/${instanceInfo.rule_template.name}/${instanceInfo.db_type}`
      : `/sqle/project/${projectID}/rule/template/detail/${instanceInfo.rule_template.name}/${instanceInfo.db_type}`;

    return (
      <BasicToolTips
        title={
          <Link to={path} target="_blank">
            {t('rule.form.ruleTemplate')}: {instanceInfo.rule_template.name}
          </Link>
        }
      >
        <BasicButton
          style={{ width: 36, height: 36 }}
          icon={
            <ProfileSquareFilled
              width={18}
              height={18}
              color={sqleTheme.icon.execWorkFlow.profileSquareFilled}
            />
          }
        />
      </BasicToolTips>
    );
  }, [instanceInfo, projectID, t, sqleTheme]);

  return (
    <div>
      <FormItemLabel
        label={t('sqlOptimization.create.sqlInfo.instanceName')}
        className="has-required-style"
        style={{ marginBottom: 16 }}
        required={true}
      />
      <Space align="start" size={12}>
        <FormItemNoLabel
          name="instanceName"
          rules={[
            {
              required: true,
              message: t('common.form.placeholder.select', {
                name: t('sqlOptimization.create.sqlInfo.instanceName')
              })
            }
          ]}
        >
          <CustomSelect
            className="data-source-row-select"
            allowClear={false}
            prefix={
              <CommonIconStyleWrapper>
                <DatabaseFilled width={18} height={18} />
              </CommonIconStyleWrapper>
            }
            valuePrefix={
              <CommonIconStyleWrapper>
                <DatabaseFilled
                  width={18}
                  height={18}
                  color={sqleTheme.icon.execWorkFlow.databaseFilled}
                />
              </CommonIconStyleWrapper>
            }
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
              required: true,
              message: t('common.form.placeholder.select', {
                name: t('sqlOptimization.create.sqlInfo.instanceSchema')
              })
            }
          ]}
        >
          <CustomSelect
            className="data-source-row-select"
            size="middle"
            disabled={submitLoading || !instanceName}
            prefix={
              <CommonIconStyleWrapper>
                <DatabaseSchemaFilled width={18} height={18} />
              </CommonIconStyleWrapper>
            }
            valuePrefix={
              <CommonIconStyleWrapper>
                <DatabaseSchemaFilled
                  width={18}
                  height={18}
                  color={sqleTheme.icon.execWorkFlow.schemaFilled}
                />
              </CommonIconStyleWrapper>
            }
            loading={getInstanceSchemaListLoading}
            placeholder={t('common.form.placeholder.select', {
              name: t('sqlOptimization.create.sqlInfo.instanceSchema')
            })}
            options={schemaList.map((item) => ({
              label: item,
              value: item
            }))}
          />
        </FormItemNoLabel>
        {renderRuleTemplateDisplay()}
      </Space>
      <Alert
        type="warning"
        message={t('sqlOptimization.create.sqlInfo.tips')}
        showIcon
        style={{ marginBottom: 16 }}
      />
    </div>
  );
};

export default DatabaseInfo;
