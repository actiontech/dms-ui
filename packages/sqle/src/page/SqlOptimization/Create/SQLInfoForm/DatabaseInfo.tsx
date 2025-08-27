import { useTranslation } from 'react-i18next';
import { DatabaseInfoProps } from '../../index.type';
import { useCallback, useState } from 'react';
import { Alert, Form, Space } from 'antd';
import { CustomSelect } from '@actiontech/shared/lib/components/CustomSelect';
import useInstanceSchema from '../../../../hooks/useInstanceSchema';
import { IInstanceResV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import instance from '@actiontech/shared/lib/api/sqle/service/instance';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import {
  BasicButton,
  BasicToolTip,
  FormItemLabel,
  FormItemNoLabel,
  TypedLink
} from '@actiontech/shared';
import {
  DatabaseSchemaFilled,
  DatabaseFilled,
  ProfileSquareFilled
} from '@actiontech/icons';
import useThemeStyleData from '../../../../hooks/useThemeStyleData';
import { CommonIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
import { useSelector } from 'react-redux';
import { IReduxState } from '../../../../store';

const DatabaseInfo: React.FC<DatabaseInfoProps> = ({
  form,
  instanceLoading,
  instanceOptions
}) => {
  const { t } = useTranslation();
  const { projectID, projectName } = useCurrentProject();
  const { sqleTheme } = useThemeStyleData();
  const submitLoading = useSelector(
    (state: IReduxState) => state.sqlOptimization.submitLoading
  );

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

    const path = instanceInfo.rule_template.is_global_rule_template
      ? ROUTE_PATHS.SQLE.RULE_MANAGEMENT.detail
      : ROUTE_PATHS.SQLE.RULE_TEMPLATE.detail;

    return (
      <BasicToolTip
        title={
          <TypedLink
            to={path}
            params={{
              projectID,
              dbType: instanceInfo.db_type ?? '',
              templateName: instanceInfo.rule_template.name ?? ''
            }}
            target="_blank"
          >
            {t('rule.form.ruleTemplate')}: {instanceInfo.rule_template.name}
          </TypedLink>
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
      </BasicToolTip>
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
