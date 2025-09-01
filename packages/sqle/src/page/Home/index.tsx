import { useRequest } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@actiontech/dms-kit';
import DBAPanel from './DBAPanel';
import DEVPanel from './DEVPanel';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import dashboard from '@actiontech/shared/lib/api/sqle/service/dashboard';
const Home = () => {
  const { t } = useTranslation();
  const { projectName } = useCurrentProject();
  const { data: workflowStatistics, refresh: getWorkflowStatistics } =
    useRequest(
      () =>
        dashboard
          .getDashboardV1({
            filter_project_name: projectName
          })
          .then((res) => res.data?.data?.workflow_statistics),
      {
        refreshDeps: [projectName]
      }
    );
  return (
    <>
      <PageHeader title={t('dashboard.pageTitle')} />

      <DBAPanel
        workflowStatistics={workflowStatistics}
        getWorkflowStatistics={getWorkflowStatistics}
        projectName={projectName}
      />
      <DEVPanel
        workflowStatistics={workflowStatistics}
        getWorkflowStatistics={getWorkflowStatistics}
        projectName={projectName}
      />
      {/* todo 智能扫描重构，先隐藏 
       <AuditPlanRiskList projectName={projectName} projectID={projectID} /> */}
    </>
  );
};
export default Home;
