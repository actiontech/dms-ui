import { useRequest } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@actiontech/shared';
import DBAPanel from './DBAPanel';
import DEVPanel from './DEVPanel';
import AuditPlanRiskList from './AuditPlanRiskList';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import dashboard from '@actiontech/shared/lib/api/sqle/service/dashboard';
import './index.less';

export const ALL_PROJECT_NAME = '';

const Home = () => {
  const { t } = useTranslation();
  const { projectName, projectID } = useCurrentProject();

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
      <PageHeader title={t('dmsMenu.todoList')} />

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
      <AuditPlanRiskList projectName={projectName} projectID={projectID} />
    </>
  );
};

export default Home;
