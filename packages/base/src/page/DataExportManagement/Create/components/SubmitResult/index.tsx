import { BasicButton, BasicResult } from '@actiontech/dms-kit';
import { TypedLink } from '@actiontech/shared';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { useTranslation } from 'react-i18next';
import useCreateDataExportReduxManage from '../../hooks/index.redux';
import { ROUTE_PATHS } from '@actiontech/dms-kit';
const ExportWorkflowSubmitResult: React.FC = () => {
  const { t } = useTranslation();
  const { projectID } = useCurrentProject();
  const { formValues, workflowID } = useCreateDataExportReduxManage();
  return (
    <BasicResult
      status="success"
      title={t('dmsDataExport.create.result.success')}
      subTitle={formValues?.baseValues.desc}
      extra={[
        <TypedLink
          key="jumpToOrderDetail"
          to={ROUTE_PATHS.BASE.DATA_EXPORT.detail}
          params={{
            projectID,
            workflowID: workflowID ?? ''
          }}
        >
          <BasicButton type="primary">
            {t('dmsDataExport.create.result.guide')}
          </BasicButton>
        </TypedLink>
      ]}
    />
  );
};
export default ExportWorkflowSubmitResult;
