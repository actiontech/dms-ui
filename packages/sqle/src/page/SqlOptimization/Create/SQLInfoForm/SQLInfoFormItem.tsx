import { useTranslation } from 'react-i18next';
import { useContext, useEffect } from 'react';
import { SqlInfoFormProps } from '../../index.type';
import { UploadTypeEnum } from '../../../SqlAudit/Create/SQLInfoForm/index.type';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { Form, Space } from 'antd';
import { BasicButton, BasicToolTip } from '@actiontech/shared';
import DatabaseInfo from './DatabaseInfo';
import useInstance from '../../../../hooks/useInstance';
import SQLStatementForm from '../SQLStatementForm';
import { getInstanceTipListV1FunctionalModuleEnum } from '@actiontech/shared/lib/api/sqle/service/instance/index.enum';
import { FormSubmitStatusContext } from '..';
import {
  FormatLanguageSupport,
  formatterSQL
} from '@actiontech/shared/lib/utils/FormatterSQL';
import { InfoCircleOutlined } from '@actiontech/icons';

const SQLInfoFormItem: React.FC<SqlInfoFormProps> = ({ form, submit }) => {
  const { t } = useTranslation();
  const { projectName } = useCurrentProject();
  const submitLoading = useContext(FormSubmitStatusContext);

  const uploadType = Form.useWatch('uploadType', form);

  const {
    instanceOptions,
    updateInstanceList,
    instanceList,
    loading: instanceLoading
  } = useInstance();

  useEffect(() => {
    updateInstanceList({
      project_name: projectName,
      functional_module:
        getInstanceTipListV1FunctionalModuleEnum.create_optimization
    });
  }, [projectName, updateInstanceList]);

  const formatSql = async () => {
    const values = await form.getFieldsValue();
    const dbType = instanceList.find(
      (v) => v.instance_name === values.instanceName
    )?.instance_type;
    const sql = formatterSQL(values.sql, dbType);
    form.setFieldsValue({
      sql
    });
  };

  return (
    <>
      <DatabaseInfo
        form={form}
        instanceLoading={instanceLoading}
        instanceOptions={instanceOptions}
      />
      <SQLStatementForm form={form} />
      <Space size={12}>
        <BasicButton
          className="create-optimization-button"
          onClick={submit}
          type="primary"
          loading={submitLoading}
        >
          {t('sqlOptimization.create.sqlInfo.optimize')}
        </BasicButton>
        <Space hidden={uploadType !== UploadTypeEnum.sql}>
          <BasicButton onClick={formatSql} loading={submitLoading}>
            {t('sqlOptimization.create.sqlInfo.format')}
          </BasicButton>
          <BasicToolTip
            prefixIcon={<InfoCircleOutlined />}
            title={t('sqlOptimization.create.sqlInfo.formatTips', {
              supportType: Object.keys(FormatLanguageSupport).join('、')
            })}
          />
        </Space>
      </Space>
    </>
  );
};

export default SQLInfoFormItem;
