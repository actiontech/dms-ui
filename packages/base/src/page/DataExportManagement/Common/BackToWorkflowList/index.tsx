import { BasicButton } from '@actiontech/shared';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { LeftArrowOutlined } from '@actiontech/icons';

const BackToWorkflowList: React.FC = () => {
  const { projectID } = useCurrentProject();
  const { t } = useTranslation();

  return (
    <Link to={`/project/${projectID}/data/export`}>
      <BasicButton icon={<LeftArrowOutlined />}>
        {t('dmsDataExport.create.backToList')}
      </BasicButton>
    </Link>
  );
};

export default BackToWorkflowList;
