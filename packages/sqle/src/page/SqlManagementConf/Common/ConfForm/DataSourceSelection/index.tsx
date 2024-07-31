import {
  CustomLabelContent,
  FormItemLabel,
  FormItemSubTitle
} from '@actiontech/shared/lib/components/FormCom';
import { useTranslation } from 'react-i18next';
import { BasicSelect, BasicSwitch, EmptyBox } from '@actiontech/shared';
import {
  useCurrentProject,
  useProjectBusinessTips
} from '@actiontech/shared/lib/global';
import { Form } from 'antd';
import useInstance from '../../../../../hooks/useInstance';
import { useContext, useEffect, useMemo } from 'react';
import useDatabaseType from '../../../../../hooks/useDatabaseType';
import { ConfFormContext } from '../context';
import { SqlManagementConfFormFields } from '../index.type';
import { useSearchParams } from 'react-router-dom';

const DataSourceSelection: React.FC = () => {
  const { t } = useTranslation();
  const { projectName } = useCurrentProject();
  const [searchParams] = useSearchParams();

  const { instanceNameByUrlSearchParams, businessByUrlSearchParams } =
    useMemo(() => {
      return {
        instanceNameByUrlSearchParams: searchParams.get('instance_name'),
        businessByUrlSearchParams: searchParams.get('business')
      };
    }, [searchParams]);

  const submitLoading = !!useContext(ConfFormContext)?.submitLoading;
  const defaultValue = useContext(ConfFormContext)?.defaultValue;

  const {
    updateProjectBusinessTips,
    projectBusinessOption,
    loading: getProjectBusinessTipsLoading
  } = useProjectBusinessTips();

  const form = Form.useFormInstance<SqlManagementConfFormFields>();
  const needConnectDataSource = Form.useWatch('needConnectDataSource', form);
  const businessScope = Form.useWatch('businessScope', form);
  const instanceType = Form.useWatch('instanceType', form);

  const {
    instanceIDOptions,
    instanceOptions,
    updateInstanceList,
    loading: getInstanceLoading,
    instanceList
  } = useInstance();

  const {
    loading: getDriverMetaLoading,
    updateDriverNameList,
    generateDriverSelectOptions
  } = useDatabaseType();

  const handleChangeInstance = (name?: string) => {
    if (name) {
      const instanceInfo = instanceList.find((v) => v.instance_name === name);
      form.setFieldValue('instanceType', instanceInfo?.instance_type ?? null);
      form.setFieldValue('instanceId', instanceInfo?.instance_id ?? null);
    }
  };

  const handleChangeNeedConnectDataSource = (checked: boolean) => {
    if (checked && !!businessScope) {
      updateInstanceList({
        project_name: projectName,
        filter_db_type: instanceType
      });
    }
    form.resetFields(['instanceName']);
  };

  const handleChangeBusiness = (business: string) => {
    if (business && needConnectDataSource) {
      updateInstanceList({
        project_name: projectName,
        filter_db_type: instanceType
      });
    }
  };

  const handleChangeInstanceType = (type: string) => {
    form.resetFields(['scanTypes']);
    if (needConnectDataSource) {
      form.resetFields(['instanceName']);
      if (businessScope) {
        updateInstanceList({ project_name: projectName, filter_db_type: type });
      }
    }
  };

  const formItemDisabled =
    submitLoading || !!defaultValue || !!instanceNameByUrlSearchParams;

  useEffect(() => {
    updateDriverNameList();
  }, [updateDriverNameList]);

  useEffect(() => {
    if (!!instanceNameByUrlSearchParams && !!businessByUrlSearchParams) {
      updateInstanceList(
        { project_name: projectName },
        {
          onSuccess: (list) => {
            const instance = list.find(
              (v) => v.instance_name === instanceNameByUrlSearchParams
            );
            form.setFieldsValue({
              needConnectDataSource: true,
              businessScope: businessByUrlSearchParams,
              instanceName: instanceNameByUrlSearchParams,
              instanceId: instance?.instance_id,
              instanceType: instance?.instance_type
            });
          }
        }
      );
    }
  }, [
    businessByUrlSearchParams,
    form,
    instanceNameByUrlSearchParams,
    projectName,
    updateInstanceList
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
        initialValue={false}
        name="needConnectDataSource"
        label={t('managementConf.create.dataSourceNeedsAudit')}
        valuePropName="checked"
      >
        <BasicSwitch
          disabled={formItemDisabled}
          onChange={handleChangeNeedConnectDataSource}
        />
      </FormItemLabel>

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

      <EmptyBox if={needConnectDataSource}>
        <FormItemLabel
          name="instanceName"
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
            disabled={formItemDisabled}
            loading={getInstanceLoading}
            options={instanceOptions}
            onChange={handleChangeInstance}
          />
        </FormItemLabel>

        <FormItemLabel hidden={true} name="instanceId">
          <BasicSelect
            disabled={formItemDisabled}
            loading={getInstanceLoading}
            options={instanceIDOptions}
          />
        </FormItemLabel>
      </EmptyBox>
    </>
  );
};

export default DataSourceSelection;
