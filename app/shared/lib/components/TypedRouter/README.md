---
title: 增强类型安全性和路由路径管理的工具集合
category: business
---

## Example

```tsx
const Com = () => {
  const { projectID } = useCurrentProject();
  const navigate = useTypedNavigate();
  const exactQueries = useTypedQuery();

  // 自动推导出 params 类型为
  // {
  //   projectID: string;
  // } & {
  //     taskId: string;
  //     fileId: string;
  // }
  //
  const params =
    useTypedParams<
      typeof ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.sql_files_overview
    >();

  useEffect(() => {
     // { instance_id: string, source: string }
    const searchParams = exactQueries(ROUTE_PATHS.SQLE.SQL_MANAGEMENT.index)
  }, [])
  

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
            params: {
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
            params: { projectID }
          });
        }}
      >
        跳转至工单创建
      </BasicButton>
      <TypedLink to={ROUTE_PATHS.SQLE.RULE}>跳转至规则列表</TypedLink>
      <TypedLink
        to={ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.index}
        params={{ projectID }}
      >
        跳转至SQL工单
      </TypedLink>
      <TypedLink
        to={ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.analyze}
        params={{ projectID, taskId: '10', sqlNum: '1' }}
      >
        跳转至SQL分析
      </TypedLink>
      <TypedLink
        to={ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.sql_files_overview}
        params={{ projectID, taskId: '11', fileId: '1' }}
      >
        跳转至SQL文件概览
      </TypedLink>
      <TypedLink
        to={ROUTE_PATHS.SQLE.SQL_MANAGEMENT.index}
        params={{ projectID }}
        queries={{ instance_id: '123' }}
      >
        跳转至SQL管控
      </TypedLink>
      <BasicButton
        onClick={() => {
          navigate(ROUTE_PATHS.SQLE.SQL_MANAGEMENT.index, {
            params: { projectID }
            queries: { instance_id: '123', source: 'mysql_slow_log' }
          });
        }}
      >
        跳转至SQL管控-完整query
      </BasicButton>
    </Space>
  );
}
```
