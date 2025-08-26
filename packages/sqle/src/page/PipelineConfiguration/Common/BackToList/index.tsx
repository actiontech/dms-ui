import { ActionButton } from '@actiontech/shared';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { useTranslation } from 'react-i18next';
import { LeftArrowOutlined } from '@actiontech/icons';
import { ROUTE_PATHS } from '@actiontech/dms-kit';
const BackToList: React.FC = () => {
  const { t } = useTranslation();
  const { projectID } = useCurrentProject();
  return (
    <ActionButton
      icon={<LeftArrowOutlined />}
      text={t('pipelineConfiguration.create.backToPipelineList')}
      actionType="navigate-link"
      link={{
        to: ROUTE_PATHS.SQLE.PIPELINE_CONFIGURATION.index,
        params: {
          projectID
        }
      }}
    />
  );
};
export default BackToList;
