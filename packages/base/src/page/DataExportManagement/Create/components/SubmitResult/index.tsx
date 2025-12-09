import { BasicButton, BasicResult } from '@actiontech/dms-kit';
import { TypedLink } from '@actiontech/shared';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { useTranslation } from 'react-i18next';
import useCreateDataExportReduxManage from '../../hooks/index.redux';
import { ROUTE_PATHS } from '@actiontech/dms-kit';
import { Space, Typography } from 'antd';
import { SubmitResultAlertStyleWrapper } from './style';

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
        <Space direction="vertical" size={32} key="retentionNotice">
          <SubmitResultAlertStyleWrapper
            message={t('dmsDataExport.create.result.alertTitle')}
            description={
              <Space direction="vertical" size={8}>
                <Typography.Text>
                  <Typography.Text strong>
                    {t('dmsDataExport.create.result.exportTimeLimitTitle')}
                  </Typography.Text>
                  {t('dmsDataExport.create.result.exportTimeLimitDesc')}
                </Typography.Text>
                <Typography.Text>
                  <Typography.Text strong>
                    {t('dmsDataExport.create.result.fileDownloadLimitTitle')}
                  </Typography.Text>
                  {t('dmsDataExport.create.result.fileDownloadLimitDesc')}
                </Typography.Text>
                <Typography.Text>
                  {t('dmsDataExport.create.result.reminder')}
                </Typography.Text>
              </Space>
            }
            type="info"
            showIcon
          />
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
