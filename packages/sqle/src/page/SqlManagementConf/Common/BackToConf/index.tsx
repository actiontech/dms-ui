import { ActionButton } from '@actiontech/shared';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { useTranslation } from 'react-i18next';
import { LeftArrowOutlined } from '@actiontech/icons';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

const BackToConf: React.FC = () => {
  const { t } = useTranslation();
  const { projectID } = useCurrentProject();
  return (
    <ActionButton
      icon={<LeftArrowOutlined />}
      text={t('managementConf.common.backToConf')}
      actionType="navigate-link"
      link={{
        to: ROUTE_PATHS.SQLE.SQL_MANAGEMENT_CONF.index,
        params: { projectID }
      }}
    />
  );
};

export default BackToConf;
