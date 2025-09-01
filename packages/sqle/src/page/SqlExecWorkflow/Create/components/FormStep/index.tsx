import { FormStyleWrapper } from '@actiontech/dms-kit/es/components/CustomForm/style';
import BaseInfoForm from './BaseInfoForm';
import { CreateWorkflowFormStepProps } from './index.type';
import { PageLayoutHasFixedHeaderStyleWrapper } from '@actiontech/dms-kit';
import { BasicButton, PageHeader, EmptyBox } from '@actiontech/dms-kit';
import { useTranslation } from 'react-i18next';
import SqlAuditInfoForm from './SqlAuditInfoForm';
import { SqlAuditInfoFormStyleWrapper } from './style';
import { useCallback } from 'react';
import dayjs from 'dayjs';
import BackToList from '../../../Common/BackToList';
import { Tour } from 'antd';
import type { TourProps } from 'antd';
import { useState, useRef, useMemo } from 'react';
import useCreationMode from '../../hooks/useCreationMode';
const FormStep: React.FC<CreateWorkflowFormStepProps> = ({
  baseInfoForm,
  sqlAuditInfoForm,
  auditAction,
  ...sharedStepDetail
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState<boolean>(true);
  const { isCloneMode } = useCreationMode();
  const workflowNameFieldRef = useRef<HTMLElement>(null);
  const dataSourceFieldRef = useRef<HTMLElement>(null);
  const tourSteps: TourProps['steps'] = useMemo(
    () => [
      {
        title: t('execWorkflow.create.form.tour.modifyName'),
        target: () => workflowNameFieldRef.current!
      },
      {
        title: t('execWorkflow.create.form.tour.modifyDataSource'),
        target: () => dataSourceFieldRef.current!
      }
    ],
    [t]
  );
  const resetAllForm = () => {
    baseInfoForm.resetFields();
    sqlAuditInfoForm.resetFields();
    sharedStepDetail.resetAllSharedData();
  };
  const handleInstanceNameChange = useCallback(
    (name: string) => {
      if (!baseInfoForm.isFieldTouched('workflow_subject')) {
        baseInfoForm.setFieldsValue({
          workflow_subject: `${name}_${dayjs().format('YYYYMMDDhhmmss')}`
        });
      }
    },
    [baseInfoForm]
  );
  return (
    <PageLayoutHasFixedHeaderStyleWrapper>
      <PageHeader
        fixed
        title={<BackToList isAuditing={sharedStepDetail.isAuditing.value} />}
        extra={
          <BasicButton
            onClick={resetAllForm}
            disabled={sharedStepDetail.isAuditing.value}
          >
            {t('common.reset')}
          </BasicButton>
        }
      />
      <FormStyleWrapper
        form={baseInfoForm}
        className="hasTopHeader clearPaddingBottom"
        colon={false}
        layout="vertical"
        labelAlign="left"
      >
        <BaseInfoForm ref={workflowNameFieldRef} />
      </FormStyleWrapper>
      <SqlAuditInfoFormStyleWrapper
        form={sqlAuditInfoForm}
        colon={false}
        labelAlign="left"
      >
        <SqlAuditInfoForm
          handleInstanceNameChange={handleInstanceNameChange}
          auditAction={auditAction}
          {...sharedStepDetail}
          ref={dataSourceFieldRef}
        />
      </SqlAuditInfoFormStyleWrapper>
      <EmptyBox if={isCloneMode}>
        <Tour open={open} onClose={() => setOpen(false)} steps={tourSteps} />
      </EmptyBox>
    </PageLayoutHasFixedHeaderStyleWrapper>
  );
};
export default FormStep;
