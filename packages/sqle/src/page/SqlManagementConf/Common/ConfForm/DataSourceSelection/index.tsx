import {
  FormItemLabel,
  FormItemSubTitle
} from '@actiontech/shared/lib/components/FormCom';
import { useTranslation } from 'react-i18next';
import {
  BasicInput,
  BasicSelect,
  BasicSwitch,
  EmptyBox,
  LazyLoadComponent
} from '@actiontech/shared';
import {
  useCurrentProject,
  useProjectBusinessTips
} from '@actiontech/shared/lib/global';
import { Form } from 'antd';
import useInstance from '../../../../../hooks/useInstance';
import { useContext, useEffect } from 'react';
import useDatabaseType from '../../../../../hooks/useDatabaseType';
import { ConfFormContext } from '../context';
import { SqlManagementConfFormFields } from '../index.type';

const DataSourceSelection: React.FC = () => {
  const { t } = useTranslation();
  const { projectName } = useCurrentProject();

  const submitLoading = !!useContext(ConfFormContext)?.submitLoading;
  const defaultValue = useContext(ConfFormContext)?.defaultValue;

  const { updateProjectBusinessTips, projectBusinessOption, isFixedBusiness } =
    useProjectBusinessTips();

  const form = Form.useFormInstance<SqlManagementConfFormFields>();
  const needConnectDataSource = Form.useWatch('needConnectDataSource', form);

  const {
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
    }
  };

  const handleChangeNeedConnectDataSource = (checked: boolean) => {
    if (checked) {
      updateInstanceList({ project_name: projectName });
    }
    form.resetFields(['instanceName', 'instanceSchema', 'scanTypes']);
  };

  const handleChangeInstanceType = (type: string) => {
    form.resetFields(['scanTypes']);
    if (needConnectDataSource) {
      form.resetFields(['instanceName']);
      updateInstanceList({ project_name: projectName, filter_db_type: type });
    }
  };

  const formItemDisabled = submitLoading || !!defaultValue;

  useEffect(() => {
    updateDriverNameList();
  }, [updateDriverNameList]);

  // #if [ee]
  useEffect(() => {
    updateProjectBusinessTips();
  }, [updateProjectBusinessTips]);
  // #endif

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

      <EmptyBox
        if={isFixedBusiness}
        defaultNode={
          <FormItemLabel
            className="has-required-style"
            label={t('dmsDataSource.dataSourceForm.business')}
            name="businessScope"
            rules={[{ required: true }]}
          >
            <BasicInput disabled={formItemDisabled} />
          </FormItemLabel>
        }
      >
        <FormItemLabel
          className="has-required-style"
          label={t('dmsDataSource.dataSourceForm.business')}
          name="businessScope"
          rules={[{ required: true }]}
        >
          <BasicSelect
            disabled={formItemDisabled}
            options={projectBusinessOption()}
          />
        </FormItemLabel>
      </EmptyBox>

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

      <LazyLoadComponent open={needConnectDataSource} animation={false}>
        <FormItemLabel
          name="instanceName"
          rules={[{ required: true }]}
          label={t('managementConf.create.instanceName')}
          className="has-required-style"
        >
          <BasicSelect
            disabled={formItemDisabled}
            loading={getInstanceLoading}
            options={instanceOptions}
            onChange={handleChangeInstance}
          />
        </FormItemLabel>
      </LazyLoadComponent>
    </>
  );
};

export default DataSourceSelection;
