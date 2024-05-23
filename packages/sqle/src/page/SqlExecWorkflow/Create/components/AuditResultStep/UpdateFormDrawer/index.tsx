import { BasicDrawer } from '@actiontech/shared';
import {
  UpdateBaseInfoFormStyleWrapper,
  UpdateWorkflowFormTitleStyleWrapper,
  UpdateSqlAuditInfoFormStyleWrapper
} from './style';
import { useForm } from 'antd/es/form/Form';
import { useTranslation } from 'react-i18next';
import BaseInfoTag from './BaseInfoTag';
import { useRef } from 'react';
import { Divider, Spin } from 'antd';
import {
  SqlAuditInfoFormFields,
  WorkflowBaseInfoFormFields
} from '../../../index.type';
import { UpdateFormDrawerProps } from './index.type';
import { SqlAuditInfoFormProps } from '../../FormStep/SqlAuditInfoForm/index.type';
import BaseInfoFormItem from '../../FormStep/BaseInfoForm/BaseInfoFormItem';
import SqlAuditInfoFormItem from '../../FormStep/SqlAuditInfoForm/SqlAuditInfoFormItem';

const UpdateFormDrawer: React.FC<UpdateFormDrawerProps> = ({
  open,
  onClose,
  baseFormValues,
  sqlAuditInfoFormValues,
  auditAction,
  handleInstanceNameChange,
  ...sharedStepDetail
}) => {
  const { t } = useTranslation();
  const syncDataReady = useRef(false);
  const [baseInfoForm] = useForm<WorkflowBaseInfoFormFields>();
  const [sqlAuditInfoForm] = useForm<SqlAuditInfoFormFields>();

  const closeHandle = () => {
    if (sharedStepDetail.isAuditing.value) {
      return;
    }

    onClose();
  };

  const internalSubmit: SqlAuditInfoFormProps['auditAction'] = async (
    values
  ) => {
    await baseInfoForm.validateFields();
    return auditAction(values, baseInfoForm.getFieldsValue()).finally(() => {
      onClose();
    });
  };

  return (
    <BasicDrawer
      afterOpenChange={(_open) => {
        if (_open && !syncDataReady.current) {
          baseInfoForm.setFieldsValue({ ...baseFormValues });
          sqlAuditInfoForm.setFieldsValue({ ...sqlAuditInfoFormValues });
          syncDataReady.current = true;
        }
      }}
      open={open}
      size="large"
      title={false}
      closeIcon={false}
      onClose={closeHandle}
      bodyStyle={{
        padding: 0
      }}
      width={735}
      noBodyPadding
    >
      <Spin spinning={sharedStepDetail.isAuditing.value}>
        <UpdateBaseInfoFormStyleWrapper form={baseInfoForm}>
          <UpdateWorkflowFormTitleStyleWrapper>
            {t('execWorkflow.create.form.baseInfo.title')}
          </UpdateWorkflowFormTitleStyleWrapper>
          <BaseInfoFormItem slot={<BaseInfoTag />} />
        </UpdateBaseInfoFormStyleWrapper>

        <Divider style={{ marginTop: 12 }} />

        <UpdateSqlAuditInfoFormStyleWrapper
          labelAlign="left"
          form={sqlAuditInfoForm}
          colon={false}
        >
          <UpdateWorkflowFormTitleStyleWrapper>
            {t('execWorkflow.create.form.sqlInfo.title')}
          </UpdateWorkflowFormTitleStyleWrapper>
          <SqlAuditInfoFormItem
            auditAction={internalSubmit}
            handleInstanceNameChange={handleInstanceNameChange}
            {...sharedStepDetail}
          />
        </UpdateSqlAuditInfoFormStyleWrapper>
      </Spin>
    </BasicDrawer>
  );
};

export default UpdateFormDrawer;
