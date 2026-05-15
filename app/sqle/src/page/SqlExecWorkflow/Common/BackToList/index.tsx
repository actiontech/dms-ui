import { ActionButton } from '@actiontech/shared';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { useTranslation } from 'react-i18next';
import { LeftArrowOutlined } from '@actiontech/icons';
import { ROUTE_PATHS } from '@actiontech/dms-kit';
const BackToList: React.FC<{
  isAuditing?: boolean;
}> = ({ isAuditing }) => {
  const { t } = useTranslation();
  const { projectID } = useCurrentProject();
  return (
    <ActionButton
      icon={<LeftArrowOutlined />}
      disabled={isAuditing}
      text={t('execWorkflow.create.backToList')}
      actionType="navigate-link"
      link={{
        to: ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.index,
        params: {
          projectID
        }
      }}
    />
  );
};
export default BackToList;
