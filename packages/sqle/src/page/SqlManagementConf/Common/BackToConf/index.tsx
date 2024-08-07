import { BasicButton } from '@actiontech/shared';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { LeftArrowOutlined } from '@actiontech/icons';

const BackToConf: React.FC = () => {
  const { t } = useTranslation();
  const { projectID } = useCurrentProject();
  return (
    <Link to={`/sqle/project/${projectID}/sql-management-conf`}>
      <BasicButton icon={<LeftArrowOutlined />}>
        {t('managementConf.common.backToConf')}
      </BasicButton>
    </Link>
  );
};

export default BackToConf;
