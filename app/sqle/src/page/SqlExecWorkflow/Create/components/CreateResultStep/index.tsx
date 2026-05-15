import { BasicResult, PageHeader } from '@actiontech/dms-kit';
import { useTranslation } from 'react-i18next';
import { CreateResultStepProps } from './index.type';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import BackToList from '../../../Common/BackToList';
import { ROUTE_PATHS } from '@actiontech/dms-kit';
import { ActionButton } from '@actiontech/shared';
const CreateResultStep: React.FC<CreateResultStepProps> = ({
  workflowID,
  desc
}) => {
  const { t } = useTranslation();
  const { projectID } = useCurrentProject();
  return (
    <>
      <PageHeader title={<BackToList isAuditing={false} />} />
      <BasicResult
        status="success"
        title={t('execWorkflow.create.createResult.success')}
        subTitle={desc}
        extra={
          <ActionButton
            actionType="navigate-link"
            link={{
              to: ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.detail,
              params: {
                projectID,
                workflowId: workflowID
              }
            }}
            type="primary"
            text={t('execWorkflow.create.createResult.guide')}
          />
        }
      />
    </>
  );
};
export default CreateResultStep;
