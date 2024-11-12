import { BasicButton, TypedLink } from '@actiontech/shared';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { useTranslation } from 'react-i18next';
import { LeftArrowOutlined } from '@actiontech/icons';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

const BackToWorkflowList: React.FC = () => {
  const { projectID } = useCurrentProject();
  const { t } = useTranslation();

  return (
    <TypedLink to={ROUTE_PATHS.BASE.DATA_EXPORT.index} params={{ projectID }}>
      <BasicButton icon={<LeftArrowOutlined />}>
        {t('dmsDataExport.create.backToList')}
      </BasicButton>
    </TypedLink>
  );
};

export default BackToWorkflowList;
