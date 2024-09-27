import { BasicButton } from '@actiontech/shared';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { LeftArrowOutlined } from '@actiontech/icons';

const BackToList: React.FC = () => {
  const { t } = useTranslation();
  const { projectID } = useCurrentProject();
  return (
    <Link to={`/sqle/project/${projectID}/version-management`}>
      <BasicButton icon={<LeftArrowOutlined />}>
        {t('versionManagement.operation.backToListPage')}
      </BasicButton>
    </Link>
  );
};

export default BackToList;
