import { BasicButton } from '@actiontech/shared';
import { IconLeftArrow } from '@actiontech/shared/lib/Icon/common';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const BackToList: React.FC<{ isAuditing?: boolean }> = ({ isAuditing }) => {
  const { t } = useTranslation();
  const { projectID } = useCurrentProject();
  return (
    <Link to={`/sqle/project/${projectID}/exec-workflow`}>
      <BasicButton icon={<IconLeftArrow />} disabled={isAuditing}>
        {t('execWorkflow.create.backToList')}
      </BasicButton>
    </Link>
  );
};

export default BackToList;
