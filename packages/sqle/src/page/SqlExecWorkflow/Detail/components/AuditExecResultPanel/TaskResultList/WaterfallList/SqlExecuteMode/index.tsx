import { List } from 'antd';
import { SqlExecuteModeProps } from './index.type';
import { useInfiniteScroll } from 'ahooks';
import task from '@actiontech/shared/lib/api/sqle/service/task';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import ResultCard from '../../Common/ResultCard';
import { useCallback, useRef } from 'react';
import { IAuditTaskSQLResV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import { cloneDeep } from 'lodash';
import InfiniteScroll from 'react-infinite-scroll-component';
import { WorkflowResV2ExecModeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { WORKFLOW_OVERVIEW_TAB_KEY } from '../../../../../hooks/useAuditExecResultPanelSetup';
import { TaskResultListLayoutEnum } from '../../../index.enum';

const SqlExecuteMode: React.FC<SqlExecuteModeProps> = ({
  tableFilterInfo,
  taskId,
  execStatusFilterValue,
  noDuplicate,
  currentListLayout,
  workflowStatus,
  auditResultActiveKey,
  backupConflict,
  dbType,
  enableBackup,
  taskStatus
}) => {
  const { projectID } = useCurrentProject();
  const scrollPageNumber = useRef(0);

  const {
    data: currentAuditTaskInfiniteList,
    noMore,
    loading: scrollLoading,
    loadingMore,
    loadMore: next,
    mutate
  } = useInfiniteScroll<{
    list: IAuditTaskSQLResV2[];
    total: number;
  }>(
    (d) => {
      if (
        auditResultActiveKey === WORKFLOW_OVERVIEW_TAB_KEY ||
        currentListLayout !== TaskResultListLayoutEnum.scroll
      ) {
        return Promise.resolve({
          list: [],
          total: 0
        });
      }
      const page = d ? Math.ceil(d.list.length / 20) + 1 : 1;
      scrollPageNumber.current = page;
      return task
        .getAuditTaskSQLsV2({
          task_id: auditResultActiveKey,
          ...tableFilterInfo,
          page_index: `${page}`,
          page_size: '20',
          no_duplicate: noDuplicate,
          filter_exec_status: execStatusFilterValue ?? undefined
        })
        .then((res) => {
          return {
            list: res.data.data || [],
            total: res.data.total_nums || 0
          };
        });
    },
    {
      reloadDeps: [
        currentListLayout,
        auditResultActiveKey,
        tableFilterInfo,
        noDuplicate,
        execStatusFilterValue,
        workflowStatus
      ],
      isNoMore: (d) => {
        if (!d) {
          return false;
        }
        return d.list.length === d.total;
      }
    }
  );

  const onRefreshScrollList = useCallback(
    (number: number, page: number) => {
      if (auditResultActiveKey === WORKFLOW_OVERVIEW_TAB_KEY) {
        return;
      }

      task
        .getAuditTaskSQLsV2({
          task_id: auditResultActiveKey,
          ...tableFilterInfo,
          page_index: `${page}`,
          page_size: '20',
          no_duplicate: noDuplicate,
          filter_exec_status: execStatusFilterValue ?? undefined
        })
        .then((res) => {
          const { data } = res.data;
          const newList = cloneDeep(currentAuditTaskInfiniteList?.list) || [];
          newList.find((i, index) => {
            const newData = data?.find((x) => x.number === number);
            if (i.number === number && newData) {
              newList.splice(index, 1, newData);
              return true;
            }
            return false;
          });
          mutate({
            list: newList,
            total: currentAuditTaskInfiniteList?.total || 0
          });
        });
    },
    [
      auditResultActiveKey,
      tableFilterInfo,
      noDuplicate,
      execStatusFilterValue,
      currentAuditTaskInfiniteList?.list,
      currentAuditTaskInfiniteList?.total,
      mutate
    ]
  );

  const loadMore = () => {
    next && next();
  };

  const onUpdateDescription = (number: number, index: number) => {
    let currentPage = 1;
    for (let i = 2; i <= scrollPageNumber.current; i++) {
      if (index < i * 20 && index > i * 20 - 20) {
        currentPage = i;
      }
    }
    onRefreshScrollList(number, currentPage);
  };

  return (
    <InfiniteScroll
      hasMore={!noMore}
      next={loadMore}
      loader={null}
      dataLength={currentAuditTaskInfiniteList?.list?.length || 0}
      scrollableTarget="test-wrap"
    >
      <List
        bordered={false}
        itemLayout="vertical"
        loading={loadingMore || scrollLoading}
        split={false}
        dataSource={currentAuditTaskInfiniteList?.list}
        renderItem={(item, index) => {
          return (
            <List.Item key={item.number}>
              <ResultCard
                {...item}
                executeMode={WorkflowResV2ExecModeEnum.sqls}
                projectID={projectID}
                taskId={taskId}
                onUpdateDescription={() => {
                  onUpdateDescription(item.number!, index + 1);
                }}
                backupConflict={backupConflict}
                dbType={dbType}
                enableBackup={enableBackup}
                taskStatus={taskStatus}
              />
            </List.Item>
          );
        }}
        pagination={false}
      />
    </InfiniteScroll>
  );
};

export default SqlExecuteMode;
