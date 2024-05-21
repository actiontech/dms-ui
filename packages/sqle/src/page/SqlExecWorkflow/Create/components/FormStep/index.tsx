import { FormStyleWrapper } from '@actiontech/shared/lib/components/FormCom/style';
import BaseInfoForm from './BaseInfoForm';
import { CreateWorkflowFormStepProps } from './index.type';
import { PageLayoutHasFixedHeaderStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { BasicButton, PageHeader } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import SqlAuditInfoForm from './SqlAuditInfoForm';
import { SqlAuditInfoFormStyleWrapper } from './style';
import { useCallback } from 'react';
import dayjs from 'dayjs';
import BackToList from '../../../Common/BackToList';

const FormStep: React.FC<CreateWorkflowFormStepProps> = ({
  baseInfoForm,
  sqlAuditInfoForm,
  isAuditing,
  resetAllSharedData,
  ...sharedStepDetail
}) => {
  const { t } = useTranslation();

  const resetAllForm = () => {
    baseInfoForm.resetFields();
    sqlAuditInfoForm.resetFields();
    resetAllSharedData();
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
        title={<BackToList isAuditing={isAuditing.value} />}
        extra={
          <BasicButton onClick={resetAllForm} disabled={isAuditing.value}>
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
        <BaseInfoForm />
      </FormStyleWrapper>

      <SqlAuditInfoFormStyleWrapper
        form={sqlAuditInfoForm}
        colon={false}
        labelAlign="left"
      >
        <SqlAuditInfoForm
          isAuditing={isAuditing}
          resetAllSharedData={resetAllSharedData}
          handleInstanceNameChange={handleInstanceNameChange}
          {...sharedStepDetail}
        />
      </SqlAuditInfoFormStyleWrapper>
    </PageLayoutHasFixedHeaderStyleWrapper>
  );
};

export default FormStep;
