import { BasicButton, BasicResult, PageHeader } from '@actiontech/shared';
import { IconSuccessResult } from '@actiontech/shared/lib/Icon/common';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { CreateResultStepProps } from './index.type';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import BackToList from '../../../Common/BackToList';

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
        icon={<IconSuccessResult />}
        title={t('execWorkflow.create.createResult.success')}
        subTitle={desc}
        extra={[
          <Link
            key="jumpToWorkflowOrderDetail"
            to={`/sqle/project/${projectID}/exec-workflow/${workflowID}`}
          >
            <BasicButton type="primary">
              {t('execWorkflow.create.createResult.guide')}
            </BasicButton>
          </Link>
        ]}
      />
    </>
  );
};

export default CreateResultStep;
