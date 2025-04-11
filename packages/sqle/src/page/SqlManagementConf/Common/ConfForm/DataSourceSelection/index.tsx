import {
  CustomLabelContent,
  FormItemLabel,
  FormItemSubTitle
} from '@actiontech/shared/lib/components/CustomForm';
import { useTranslation } from 'react-i18next';
import { BasicSelect, useTypedQuery } from '@actiontech/shared';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { Form } from 'antd';
import useInstance from '../../../../../hooks/useInstance';
import { useContext, useEffect, useMemo } from 'react';
import useDatabaseType from '../../../../../hooks/useDatabaseType';
import { ConfFormContext } from '../context';
import { SqlManagementConfFormFields } from '../index.type';
import { filterOptionByLabel } from '@actiontech/shared/lib/components/BasicSelect/utils';
import { getInstanceTipListV2FunctionalModuleEnum } from '@actiontech/shared/lib/api/sqle/service/instance/index.enum';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
import useServiceEnvironment from '../../../../../hooks/useServiceEnvironment';

const DataSourceSelection: React.FC = () => {
  const { t } = useTranslation();
  const { projectName, projectID } = useCurrentProject();
  const extractQueries = useTypedQuery();

  const { instanceIdByUrlSearchParams, environmentTagByUrlSearchParams } =
    useMemo(() => {
      const searchParams = extractQueries(
        ROUTE_PATHS.SQLE.SQL_MANAGEMENT_CONF.create
      );
      return {
        instanceIdByUrlSearchParams: searchParams?.instance_id,
        environmentTagByUrlSearchParams: searchParams?.environment_tag
      };
    }, [extractQueries]);

  const submitLoading = !!useContext(ConfFormContext)?.submitLoading;
  const defaultValue = useContext(ConfFormContext)?.defaultValue;

  const {
    environmentOptions,
    loading: getEnvironmentListLoading,
    updateEnvironmentList
  } = useServiceEnvironment();

  const form = Form.useFormInstance<SqlManagementConfFormFields>();
  const environmentTag = Form.useWatch('environmentTag', form);
  const instanceType = Form.useWatch('instanceType', form);

  const {
    instanceOptions,
    instanceIDOptions,
    updateInstanceList,
    loading: getInstanceLoading,
    instanceList
  } = useInstance();

  const {
    loading: getDriverMetaLoading,
    updateDriverNameList,
    generateDriverSelectOptions
  } = useDatabaseType();

  const handleChangeInstance = (id?: string) => {
    if (id) {
      const instanceInfo = instanceList.find((v) => v.instance_id === id);
      form.setFieldValue('instanceType', instanceInfo?.instance_type ?? null);
      form.setFieldValue('instanceName', instanceInfo?.instance_name ?? null);
    }
  };

  const handleChangeEnvironmentTag = (tag: string) => {
    form.resetFields(['instanceName', 'instanceId']);
    if (tag) {
      updateInstanceList({
        project_name: projectName,
        filter_db_type: instanceType,
        filter_by_environment_tag: tag,
        functional_module:
          getInstanceTipListV2FunctionalModuleEnum.create_audit_plan
      });
    }
  };

  const handleChangeInstanceType = (type: string) => {
    form.resetFields(['scanTypes', 'instanceId']);
    if (environmentTag) {
      updateInstanceList({
        project_name: projectName,
        filter_db_type: type,
        filter_by_environment_tag: environmentTag,
        functional_module:
          getInstanceTipListV2FunctionalModuleEnum.create_audit_plan
      });
    }
  };

  const formItemDisabled =
    submitLoading || !!defaultValue || !!instanceIdByUrlSearchParams;

  useEffect(() => {
    updateDriverNameList();
  }, [updateDriverNameList]);

  useEffect(() => {
    if (!!instanceIdByUrlSearchParams && !!environmentTagByUrlSearchParams) {
      updateInstanceList(
        {
          project_name: projectName,
          functional_module:
            getInstanceTipListV2FunctionalModuleEnum.create_audit_plan
        },
        {
          onSuccess: (list) => {
            const instance = list.find(
              (v) => v.instance_id === instanceIdByUrlSearchParams
            );
            form.setFieldsValue({
              environmentTag: environmentTagByUrlSearchParams,
              instanceId: instanceIdByUrlSearchParams,
              instanceName: instance?.instance_name ?? '',
              instanceType: instance?.instance_type ?? ''
            });
          }
        }
      );
    } else if (!!defaultValue) {
      updateInstanceList({
        project_name: projectName,
        functional_module:
          getInstanceTipListV2FunctionalModuleEnum.create_audit_plan
      });
    }
  }, [
    environmentTagByUrlSearchParams,
    instanceIdByUrlSearchParams,
    defaultValue,
    updateInstanceList,
    form,
    projectName
  ]);

  useEffect(() => {
    updateEnvironmentList(projectID);
  }, [updateEnvironmentList, projectID]);

  return (
    <>
      <FormItemSubTitle>
        {t('managementConf.create.dataSourceSelection')}
      </FormItemSubTitle>

      <FormItemLabel
        className="has-required-style"
        label={t('managementConf.create.environmentAttribute')}
        name="environmentTag"
        rules={[{ required: true }]}
      >
        <BasicSelect
          loading={getEnvironmentListLoading}
          disabled={formItemDisabled}
          options={environmentOptions}
          onChange={handleChangeEnvironmentTag}
        />
      </FormItemLabel>

      <FormItemLabel
        className="has-required-style"
        label={t('auditPlan.planForm.dataSource.dbType')}
        name="instanceType"
        rules={[
          {
            required: true
          }
        ]}
      >
        <BasicSelect
          disabled={formItemDisabled}
          placeholder={t('common.form.placeholder.select')}
          onChange={handleChangeInstanceType}
          allowClear
          loading={getDriverMetaLoading}
        >
          {generateDriverSelectOptions()}
        </BasicSelect>
      </FormItemLabel>

      <FormItemLabel name="instanceName" hidden>
        <BasicSelect options={instanceOptions} />
      </FormItemLabel>

      <FormItemLabel
        name="instanceId"
        rules={[{ required: true }]}
        label={
          <CustomLabelContent
            title={t('managementConf.create.instanceName')}
            tips={t('managementConf.create.instanceNameTips')}
          />
        }
        className="has-required-style has-label-tip"
      >
        <BasicSelect
          showSearch
          filterOption={filterOptionByLabel}
          disabled={formItemDisabled}
          loading={getInstanceLoading}
          options={instanceIDOptions}
          onChange={handleChangeInstance}
        />
      </FormItemLabel>
    </>
  );
};

export default DataSourceSelection;
