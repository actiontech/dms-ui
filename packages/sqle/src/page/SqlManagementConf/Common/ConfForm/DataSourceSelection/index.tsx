import {
  CustomLabelContent,
  FormItemLabel,
  FormItemSubTitle
} from '@actiontech/shared/lib/components/FormCom';
import { useTranslation } from 'react-i18next';
import { BasicSelect, useTypedQuery } from '@actiontech/shared';
import {
  useCurrentProject,
  useProjectBusinessTips
} from '@actiontech/shared/lib/global';
import { Form } from 'antd';
import useInstance from '../../../../../hooks/useInstance';
import { useContext, useEffect, useMemo, useCallback } from 'react';
import useDatabaseType from '../../../../../hooks/useDatabaseType';
import { ConfFormContext } from '../context';
import { SqlManagementConfFormFields } from '../index.type';
import { filterOptionByLabel } from '@actiontech/shared/lib/components/BasicSelect/utils';
import { getInstanceTipListV1FunctionalModuleEnum } from '@actiontech/shared/lib/api/sqle/service/instance/index.enum';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

const DataSourceSelection: React.FC = () => {
  const { t } = useTranslation();
  const { projectName } = useCurrentProject();
  const extraQueries = useTypedQuery();

  const { instanceIdByUrlSearchParams, businessByUrlSearchParams } =
    useMemo(() => {
      const searchParams = extraQueries(
        ROUTE_PATHS.SQLE.SQL_MANAGEMENT_CONF.create
      );
      return {
        instanceIdByUrlSearchParams: searchParams?.instance_id,
        businessByUrlSearchParams: searchParams?.business
      };
    }, [extraQueries]);

  const submitLoading = !!useContext(ConfFormContext)?.submitLoading;
  const defaultValue = useContext(ConfFormContext)?.defaultValue;

  const {
    updateProjectBusinessTips,
    projectBusinessOption,
    loading: getProjectBusinessTipsLoading
  } = useProjectBusinessTips();

  const form = Form.useFormInstance<SqlManagementConfFormFields>();
  const businessScope = Form.useWatch('businessScope', form);
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

  const handleChangeBusiness = (business: string) => {
    form.resetFields(['instanceName', 'instanceId']);
    if (business) {
      updateInstanceList({
        project_name: projectName,
        filter_db_type: instanceType,
        filter_by_business: business,
        functional_module:
          getInstanceTipListV1FunctionalModuleEnum.create_audit_plan
      });
    }
  };

  const handleChangeInstanceType = (type: string) => {
    form.resetFields(['scanTypes', 'instanceId']);
    if (businessScope) {
      updateInstanceList({
        project_name: projectName,
        filter_db_type: type,
        filter_by_business: businessScope,
        functional_module:
          getInstanceTipListV1FunctionalModuleEnum.create_audit_plan
      });
    }
  };

  const formItemDisabled =
    submitLoading || !!defaultValue || !!instanceIdByUrlSearchParams;

  useEffect(() => {
    updateDriverNameList();
  }, [updateDriverNameList]);

  const updateInstanceListByProjectName = useCallback(
    (id: string) => {
      updateInstanceList(
        {
          project_name: projectName,
          functional_module:
            getInstanceTipListV1FunctionalModuleEnum.create_audit_plan
        },
        {
          onSuccess: (list) => {
            const instance = list.find((v) => v.instance_id === id);
            form.setFieldsValue({
              instanceName: instance?.instance_name ?? '',
              instanceType: instance?.instance_type ?? ''
            });
          }
        }
      );
    },
    [form, projectName, updateInstanceList]
  );

  useEffect(() => {
    if (!!instanceIdByUrlSearchParams && !!businessByUrlSearchParams) {
      form.setFieldsValue({
        businessScope: businessByUrlSearchParams,
        instanceId: instanceIdByUrlSearchParams
      });
      updateInstanceListByProjectName(instanceIdByUrlSearchParams);
    } else if (!!defaultValue) {
      updateInstanceListByProjectName(defaultValue.instanceId as string);
    }
  }, [
    businessByUrlSearchParams,
    instanceIdByUrlSearchParams,
    defaultValue,
    updateInstanceListByProjectName,
    form
  ]);

  useEffect(() => {
    updateProjectBusinessTips();
  }, [updateProjectBusinessTips]);

  return (
    <>
      <FormItemSubTitle>
        {t('managementConf.create.dataSourceSelection')}
      </FormItemSubTitle>

      <FormItemLabel
        className="has-required-style"
        label={t('dmsDataSource.dataSourceForm.business')}
        name="businessScope"
        rules={[{ required: true }]}
      >
        <BasicSelect
          loading={getProjectBusinessTipsLoading}
          disabled={formItemDisabled}
          options={projectBusinessOption()}
          onChange={handleChangeBusiness}
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
