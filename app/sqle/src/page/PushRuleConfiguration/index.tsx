import { useTranslation } from 'react-i18next';
import { PushRuleConfigurationStyleWrapper } from './style';
import { PageHeader } from '@actiontech/dms-kit';
import { EnterpriseFeatureDisplay } from '@actiontech/shared';
import { useRequest } from 'ahooks';
import ReportPushConfigService from '@actiontech/shared/lib/api/sqle/service/ReportPushConfig';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { Spin, Typography } from 'antd';
import WorkflowUpdateNotifier from './components/WorkflowUpdateNotifier';
import SqlManagementIssuePush from './components/SqlManagementIssuePush';
const PushRuleConfiguration: React.FC = () => {
  const { t } = useTranslation();
  const { projectName } = useCurrentProject();
  const {
    data: pushRuleConfig,
    loading,
    refresh
  } = useRequest(() =>
    ReportPushConfigService.GetReportPushConfigList({
      project_name: projectName
    }).then((res) => res.data.data)
  );
  const workflowUpdateNotifierConfig = pushRuleConfig?.find(
    (v) => v.type === 'workflow'
  );
  const sqlManagementIssuePushConfig = pushRuleConfig?.find(
    (v) => v.type === 'sql_manage'
  );
  return (
    <PushRuleConfigurationStyleWrapper>
      <PageHeader title={t('pushRule.pageTitle')} />
      <Spin spinning={loading} delay={300}>
        <div className="configuration-wrapper">
          <div className="configuration-title">
            {t('pushRule.pushRule.title')}
          </div>
          <WorkflowUpdateNotifier
            refetch={refresh}
            config={workflowUpdateNotifierConfig}
          />
          <EnterpriseFeatureDisplay
            featureName={t('pushRule.pushRule.sqlManagementIssuePush.label')}
            eeFeatureDescription={
              <Typography.Paragraph className="paragraph">
                {t('pushRule.pushRule.sqlManagementIssuePush.CETips')}
              </Typography.Paragraph>
            }
            isConfigPage={true}
          >
            <SqlManagementIssuePush
              refetch={refresh}
              config={sqlManagementIssuePushConfig}
            />
          </EnterpriseFeatureDisplay>
        </div>
      </Spin>
    </PushRuleConfigurationStyleWrapper>
  );
};
export default PushRuleConfiguration;
