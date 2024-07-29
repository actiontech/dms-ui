import { BasicButton, BasicResult } from '@actiontech/shared';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { SqlManagementConfCreationResultProps } from './index.type';

const CreationResult: React.FC<SqlManagementConfCreationResultProps> = ({
  cloneForm,
  resetForm,
  id
}) => {
  const { t } = useTranslation();
  const { projectID } = useCurrentProject();

  return (
    <>
      <BasicResult
        title={t('managementConf.create.result.title')}
        extra={[
          <BasicButton key="clone" onClick={cloneForm}>
            {t('managementConf.create.result.clone')}
          </BasicButton>,
          <BasicButton key="reset" onClick={resetForm}>
            {t('managementConf.create.result.reset')}
          </BasicButton>,
          <Link
            key="jump-to-detail"
            to={`/sqle/project/${projectID}/sql-management-conf/${id}`}
          >
            <BasicButton type="primary">
              {t('managementConf.create.result.jumpToDetail')}
            </BasicButton>
          </Link>
        ]}
      />
    </>
  );
};

export default CreationResult;
