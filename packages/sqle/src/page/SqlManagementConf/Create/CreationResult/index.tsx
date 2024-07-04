import { BasicButton, BasicResult } from '@actiontech/shared';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { useTranslation } from 'react-i18next';
import { IconSuccessResult } from '@actiontech/shared/lib/Icon/common';
import { Link } from 'react-router-dom';

const CreationResult: React.FC = () => {
  const { t } = useTranslation();
  const { projectID } = useCurrentProject();

  return (
    <>
      <BasicResult
        icon={<IconSuccessResult />}
        title={t('managementConf.create.result.title')}
        // subTitle={desc}
        extra={[
          <>
            <BasicButton>{t('managementConf.create.result.clone')}</BasicButton>
          </>,
          <>
            <BasicButton>{t('managementConf.create.result.reset')}</BasicButton>
          </>,
          <Link
            key="jump-to-detail"
            to={`/sqle/project/${projectID}/sql-management-conf`}
          >
            <BasicButton type="primary">
              {t('execWorkflow.create.createResult.guide')}
            </BasicButton>
          </Link>
        ]}
      />
    </>
  );
};

export default CreationResult;
