import { BasicButton } from '@actiontech/shared';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { LeftArrowOutlined } from '@actiontech/icons';

const BackToList: React.FC<{ isAuditing?: boolean }> = ({ isAuditing }) => {
  const { t } = useTranslation();
  const { projectID } = useCurrentProject();
  return (
    <Link to={`/sqle/project/${projectID}/exec-workflow`}>
      <BasicButton icon={<LeftArrowOutlined />} disabled={isAuditing}>
        {t('execWorkflow.create.backToList')}
      </BasicButton>
    </Link>
  );
};

export default BackToList;
