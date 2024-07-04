import {
  CustomLabelContent,
  FormItemBigTitle,
  FormItemLabel,
  FormItemSubTitle
} from '@actiontech/shared/lib/components/FormCom';
import { FormAreaBlockStyleWrapper } from '@actiontech/shared/lib/components/FormCom/style';
import Icon from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { IconCreatedTitle } from '../../../../../icon/AuditPlan';
import {
  BasicInput,
  BasicSelect,
  BasicSwitch,
  LazyLoadComponent
} from '@actiontech/shared';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { Form } from 'antd';
import useInstance from '../../../../../hooks/useInstance';
import useInstanceSchema from '../../../../../hooks/useInstanceSchema';
import { useEffect } from 'react';

const DataSourceSelection: React.FC = () => {
  const { t } = useTranslation();
  const { projectName } = useCurrentProject();

  // const { updateProjectTips, projectBusinessOption, isFixedBusiness } =
  // useProjectTips();

  const form = Form.useFormInstance();
  const needConnectDataSource = Form.useWatch('needConnectDataSource', form);
  const dbName = Form.useWatch('dbName', form);

  const {
    instanceOptions,
    updateInstanceList,
    loading: getInstanceLoading
  } = useInstance();
  const {
    generateInstanceSchemaSelectOption,
    loading: getInstanceSchemaLoading,
    updateSchemaList
  } = useInstanceSchema(projectName, dbName);

  const handleChangeDbName = (name?: string) => {
    if (name) {
      updateSchemaList();
    }
    form.setFieldValue('schema', undefined);
  };

  useEffect(() => {
    if (needConnectDataSource) {
      updateInstanceList({ project_name: projectName });
    }
  }, [needConnectDataSource, projectName, updateInstanceList]);

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
        <BasicSwitch />
      </FormItemLabel>

      <FormItemLabel
        name="businessScope"
        rules={[{ required: true }]}
        label={t('managementConf.create.businessScope')}
        className="has-required-style"
      >
        <BasicInput />
      </FormItemLabel>

      <LazyLoadComponent open={needConnectDataSource} animation={false}>
        <FormItemLabel
          name="dbName"
          rules={[{ required: true }]}
          label={t('managementConf.create.dbName')}
          className="has-required-style"
        >
          <BasicSelect
            loading={getInstanceLoading}
            options={instanceOptions}
            onChange={handleChangeDbName}
          />
        </FormItemLabel>

        <FormItemLabel
          name="schema"
          className="has-label-tip"
          label={
            <CustomLabelContent
              title={t('managementConf.create.schema')}
              tips={t('managementConf.create.schemaTips')}
            />
          }
        >
          <BasicSelect loading={getInstanceSchemaLoading} disabled={!dbName}>
            {generateInstanceSchemaSelectOption()}
          </BasicSelect>
        </FormItemLabel>
      </LazyLoadComponent>
    </>
  );
};

export default DataSourceSelection;
