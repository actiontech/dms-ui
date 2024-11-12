import { useEffect, useMemo } from 'react';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { Space, Divider, Form } from 'antd';
import { FormItemNoLabel } from '@actiontech/shared/lib/components/FormCom';
import { useTranslation } from 'react-i18next';
import { CustomSelect } from '@actiontech/shared/lib/components/CustomSelect';
import { CommonIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import {
  DatabaseSchemaFilled,
  DatabaseFilled,
  ProfileSquareFilled
} from '@actiontech/icons';
import useThemeStyleData from '../../../../../../hooks/useThemeStyleData';
import instance from '@actiontech/shared/lib/api/sqle/service/instance';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import {
  BasicButton,
  BasicToolTips,
  BasicSelect,
  TypedLink
} from '@actiontech/shared';
import { useRequest } from 'ahooks';
import { DataSourceFieldProps } from '../../../index.type';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

const DataSourceField: React.FC<DataSourceFieldProps> = ({
  fieldNamePath,
  instanceOptions,
  instanceIDOptions,
  instanceList,
  instanceTipsLoading
}) => {
  const form = Form.useFormInstance();

  const { instanceIdFormName, instanceNameFormName, schemaFormName } = useMemo(
    () => ({
      instanceIdFormName: [...fieldNamePath, 'target_instance_id'],
      instanceNameFormName: [...fieldNamePath, 'target_instance_name'],
      schemaFormName: [...fieldNamePath, 'target_instance_schema']
    }),
    [fieldNamePath]
  );

  const instanceName = Form.useWatch(instanceNameFormName, form);

  const instanceId = Form.useWatch(instanceIdFormName, form);

  const { t } = useTranslation();

  const { projectName, projectID } = useCurrentProject();

  const { sqleTheme } = useThemeStyleData();

  const { data: instanceInfo, loading: getInstanceInfoLoading } = useRequest(
    () =>
      instance
        .getInstanceV2({
          instance_name: instanceName,
          project_name: projectName
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            return res.data.data;
          }
        }),
    {
      ready: !!instanceName
    }
  );

  const { data: schemaOptions, loading: getSchemaLoading } = useRequest(
    () =>
      instance
        .getInstanceSchemasV1({
          instance_name: instanceName,
          project_name: projectName
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            return res.data.data?.schema_name_list?.map((i) => ({
              label: i,
              value: i
            }));
          }
        }),
    { ready: !!instanceName }
  );

  const renderRuleTemplateDisplay = () => {
    const ruleTemplate = instanceInfo?.rule_template;
    const dbType = instanceInfo?.db_type;
    if (!ruleTemplate || !dbType) {
      return (
        <BasicButton
          className="data-source-row-rule-template"
          icon={<ProfileSquareFilled width="18" height="18" />}
        />
      );
    }

    const path = ruleTemplate.is_global_rule_template
      ? ROUTE_PATHS.SQLE.RULE_MANAGEMENT.detail
      : ROUTE_PATHS.SQLE.RULE_TEMPLATE.detail;

    return (
      <BasicToolTips
        title={
          <TypedLink
            to={path}
            params={{
              projectID,
              dbType,
              templateName: ruleTemplate.name ?? ''
            }}
            target="_blank"
          >
            {t('rule.form.ruleTemplate')}: {ruleTemplate.name}
          </TypedLink>
        }
      >
        <BasicButton
          className="data-source-row-rule-template"
          icon={
            <ProfileSquareFilled
              width="18"
              height="18"
              color={sqleTheme.icon.execWorkFlow.profileSquareFilled}
            />
          }
          loading={getInstanceInfoLoading}
        />
      </BasicToolTips>
    );
  };

  useEffect(() => {
    if (instanceId) {
      const instanceData = instanceList.find(
        (v) => v.instance_id === instanceId
      );
      form.setFieldValue(
        instanceNameFormName,
        instanceData?.instance_name ?? null
      );
    }
  }, [instanceId, form, instanceList, instanceNameFormName]);

  return (
    <Space size={12}>
      <FormItemNoLabel
        name={instanceIdFormName}
        rules={[
          {
            required: true,
            message: t('common.form.placeholder.select', {
              name: t('versionManagement.release.targetDataSource')
            })
          }
        ]}
        className="data-source-item"
      >
        <CustomSelect
          allowClear={false}
          popupMatchSelectWidth
          className="data-source-row-select"
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
          loading={instanceTipsLoading}
          options={instanceIDOptions}
          onChange={() => {
            form.setFieldValue(schemaFormName, undefined);
          }}
        />
      </FormItemNoLabel>
      <FormItemNoLabel name={instanceNameFormName} hidden>
        <BasicSelect options={instanceOptions} />
      </FormItemNoLabel>

      <FormItemNoLabel name={schemaFormName} className="data-source-item">
        <CustomSelect
          className="data-source-row-select"
          disabled={!instanceId}
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
          size="middle"
          options={schemaOptions}
          loading={getSchemaLoading}
          placeholder={t('versionManagement.release.schemaPlaceholder')}
        />
      </FormItemNoLabel>
      <FormItemNoLabel className="data-source-item">
        <Divider className="data-source-row-divider" type="vertical" />
      </FormItemNoLabel>

      <FormItemNoLabel className="data-source-item">
        {renderRuleTemplateDisplay()}
      </FormItemNoLabel>
    </Space>
  );
};

export default DataSourceField;
