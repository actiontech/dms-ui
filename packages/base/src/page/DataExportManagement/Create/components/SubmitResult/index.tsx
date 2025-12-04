import { BasicButton, BasicResult } from '@actiontech/dms-kit';
import { TypedLink } from '@actiontech/shared';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { useTranslation } from 'react-i18next';
import useCreateDataExportReduxManage from '../../hooks/index.redux';
import { ROUTE_PATHS } from '@actiontech/dms-kit';
import { Space, Typography } from 'antd';

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
        <Space direction="vertical" size={12} key="retentionNotice">
          <Typography.Text>
            {t('dmsDataExport.create.result.retentionNotice')}{' '}
            <Typography.Text strong>
              {t('dmsDataExport.create.result.retentionHours')}
            </Typography.Text>
            {t('dmsDataExport.create.result.retentionNoticeSuffix')}
          </Typography.Text>
          <Typography.Text>
            {t('dmsDataExport.create.result.reminderNotice')}
          </Typography.Text>
          <TypedLink
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
        </Space>
      ]}
    />
  );
};
export default ExportWorkflowSubmitResult;
