import { BasicButton, BasicResult } from '@actiontech/dms-kit';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { useTranslation } from 'react-i18next';
import { SqlManagementConfCreationResultProps } from './index.type';
import { ROUTE_PATHS } from '@actiontech/dms-kit';
import { ActionButton } from '@actiontech/shared';
const CreationResult: React.FC<SqlManagementConfCreationResultProps> = ({
  resetForm,
  instanceAuditPlanId
}) => {
  const { t } = useTranslation();
  const { projectID } = useCurrentProject();
  return (
    <>
      <BasicResult
        title={t('managementConf.create.result.title')}
        extra={[
          <BasicButton key="reset" onClick={resetForm}>
            {t('managementConf.create.result.reset')}
          </BasicButton>,
          <ActionButton
            type="primary"
            key="jump-to-detail"
            text={t('managementConf.create.result.jumpToDetail')}
            actionType="navigate-link"
            link={{
              to: ROUTE_PATHS.SQLE.SQL_MANAGEMENT_CONF.detail,
              params: {
                projectID,
                id: instanceAuditPlanId
              }
            }}
          />
        ]}
      />
    </>
  );
};
export default CreationResult;
