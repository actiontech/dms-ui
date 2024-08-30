import { BasicButton } from '@actiontech/shared';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { LeftArrowOutlined } from '@actiontech/icons';

const BackToList: React.FC = () => {
  const { t } = useTranslation();
  const { projectID } = useCurrentProject();
  return (
    <Link to={`/sqle/project/${projectID}/pipeline-configuration`}>
      <BasicButton icon={<LeftArrowOutlined />}>
        {t('pipelineConfiguration.create.backToPipelineList')}
      </BasicButton>
    </Link>
  );
};

export default BackToList;
