import {
  BasicButton,
  TypedLink,
  ROUTE_PATHS,
  useTypedNavigate,
  useTypedParams
} from '@actiontech/shared';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { Space } from 'antd';

const ComparisonEntry: React.FC = () => {
  const { projectID } = useCurrentProject();
  const navigate = useTypedNavigate();

  // 自动推导出 values 类型为
  // {
  //   projectID: string;
  // } & {
  //     taskId: string;
  //     fileId: string;
  // }
  //
  const values =
    useTypedParams<
      typeof ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.sql_files_overview
    >();

  return (
    <Space direction="vertical">
      {/* normal */}
      <BasicButton
        onClick={() => {
          navigate(ROUTE_PATHS.SQLE.GLOBAL_DASHBOARD);
        }}
      >
        跳转至全局DASHBOARD
      </BasicButton>
      <BasicButton
        onClick={() => {
          navigate(ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.detail, {
            values: {
              workflowId: '1846478104923475968',
              projectID
            }
          });
        }}
      >
        跳转至工单详情
      </BasicButton>
      <BasicButton
        onClick={() => {
          navigate(ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.create, {
            values: { projectID }
          });
        }}
      >
        跳转至工单创建
      </BasicButton>
      <TypedLink to={ROUTE_PATHS.SQLE.RULE}>跳转至规则列表</TypedLink>
      <TypedLink
        to={ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.index}
        values={{ projectID }}
      >
        跳转至SQL工单
      </TypedLink>
      <TypedLink
        to={ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.analyze}
        values={{ projectID, taskId: '10', sqlNum: '1' }}
      >
        跳转至SQL分析
      </TypedLink>
      <TypedLink
        to={ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.sql_files_overview}
        values={{ projectID, taskId: '11', fileId: '1' }}
      >
        跳转至SQL文件概览
      </TypedLink>
      <TypedLink
        to={ROUTE_PATHS.SQLE.SQL_MANAGEMENT.index}
        values={{ projectID, instanceId: '123' }}
      >
        跳转至SQL管控
      </TypedLink>
      <BasicButton
        onClick={() => {
          navigate(ROUTE_PATHS.SQLE.SQL_MANAGEMENT.index, {
            values: { projectID, instanceId: '123', source: 'zz' }
          });
        }}
      >
        跳转至SQL管控-完整query
      </BasicButton>
    </Space>
  );
};

export default ComparisonEntry;
