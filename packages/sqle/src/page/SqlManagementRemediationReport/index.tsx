import { BasicButton, PageHeader } from '@actiontech/shared';
import SqlManage from '@actiontech/shared/lib/api/sqle/service/SqlManage';
import { DownArrowLineOutlined } from '@actiontech/icons';
import { Card, Space, Typography, message } from 'antd';
import { useBoolean } from 'ahooks';
import { useTranslation } from 'react-i18next';

const SqlManagementRemediationReport = () => {
  const { t } = useTranslation();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [exporting, { setTrue: startExport, setFalse: finishExport }] =
    useBoolean(false);

  const handleExport = () => {
    startExport();
    const hideLoading = messageApi.loading(
      t('sqlManagement.remediationReport.exporting')
    );

    SqlManage.exportGlobalSqlManageRemediationV1({}, { responseType: 'blob' })
      .then((res) => {
        if (res.status === 200) {
          messageApi.success(
            t('sqlManagement.remediationReport.exportSuccessTips')
          );
        }
      })
      .finally(() => {
        hideLoading();
        finishExport();
      });
  };

  return (
    <article>
      {messageContextHolder}
      <PageHeader
        title={t('sqlManagement.remediationReport.pageTitle')}
        extra={
          <BasicButton
            type="primary"
            icon={<DownArrowLineOutlined />}
            onClick={handleExport}
            disabled={exporting}
          >
            {t('sqlManagement.remediationReport.exportButton')}
          </BasicButton>
        }
      />
      <Card>
        <Space direction="vertical" size={12}>
          <Typography.Title level={5}>
            {t('sqlManagement.remediationReport.scopeTitle')}
          </Typography.Title>
          <Typography.Paragraph>
            {t('sqlManagement.remediationReport.description')}
          </Typography.Paragraph>
          <Typography.Paragraph>
            {t('sqlManagement.remediationReport.scopeContent')}
          </Typography.Paragraph>
          <Typography.Text type="secondary">
            {t('sqlManagement.remediationReport.permissionTips')}
          </Typography.Text>
        </Space>
      </Card>
    </article>
  );
};

export default SqlManagementRemediationReport;
