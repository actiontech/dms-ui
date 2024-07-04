import { BasicButton, BasicResult } from '@actiontech/shared';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import useCreateDataExportReduxManage from '../../hooks/index.redux';

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
        <Link
          key="jumpToOrderDetail"
          to={`/project/${projectID}/data/export/${workflowID}`}
        >
          <BasicButton type="primary">
            {t('dmsDataExport.create.result.guide')}
          </BasicButton>
        </Link>
      ]}
    />
  );
};

export default ExportWorkflowSubmitResult;
