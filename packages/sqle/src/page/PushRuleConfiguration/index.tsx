import { useTranslation } from 'react-i18next';
import { PushRuleConfigurationStyleWrapper } from './style';
import { PageHeader } from '@actiontech/shared';
import { useRequest } from 'ahooks';
import ReportPushConfigService from '@actiontech/shared/lib/api/sqle/service/ReportPushConfig';
import {
  useCurrentProject,
  useCurrentUser
} from '@actiontech/shared/lib/global';
import { Spin } from 'antd';
import WorkflowUpdateNotifier from './components/WorkflowUpdateNotifier';
import SqlManagementIssuePush from './components/SqlManagementIssuePush';

const PushRuleConfiguration: React.FC = () => {
  const { t } = useTranslation();
  const { projectName } = useCurrentProject();
  const { isAdmin, isProjectManager } = useCurrentUser();

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

  const permission = isAdmin || isProjectManager(projectName);

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
            permission={permission}
          />
          {/* #if [ee] */}
          <SqlManagementIssuePush
            refetch={refresh}
            config={sqlManagementIssuePushConfig}
            permission={permission}
          />
          {/* #endif */}
        </div>
      </Spin>
    </PushRuleConfigurationStyleWrapper>
  );
};

export default PushRuleConfiguration;
