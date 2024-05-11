import { FileExecuteModeProps } from './index.type';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { useInfiniteScroll } from 'ahooks';
import task from '@actiontech/shared/lib/api/sqle/service/task';
import { OVERVIEW_TAB_KEY } from '../../../index.data';
import { ListLayoutEnum } from '../../../../Common/ListLayoutSelector/index.types';
import { List } from 'antd';
import { WorkflowResV2ExecModeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import ResultCard from '../../Common/ResultCard';
import { IAuditFileStatistic } from '@actiontech/shared/lib/api/sqle/service/common';
import { useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import FileModeHeader from '../../Common/FileModeHeader';

const FileExecuteMode: React.FC<FileExecuteModeProps> = ({
  taskId,
  currentListLayout,
  orderStatus,
  auditResultActiveKey
}) => {
  const { projectID } = useCurrentProject();
  const scrollPageNumber = useRef(0);

  const {
    data: currentAuditTaskInfiniteList,
    noMore,
    loading: scrollLoading,
    loadingMore,
    loadMore: next
  } = useInfiniteScroll<{
    list: IAuditFileStatistic[];
    total: number;
  }>(
    (d) => {
      if (
        auditResultActiveKey === OVERVIEW_TAB_KEY ||
        currentListLayout !== ListLayoutEnum.scroll
      ) {
        return Promise.resolve({
          list: [],
          total: 0
        });
      }
      const page = d ? Math.ceil(d.list.length / 20) + 1 : 1;
      scrollPageNumber.current = page;
      return task
        .getAuditFileList({
          task_id: auditResultActiveKey,
          page_index: `${page}`,
          page_size: '20'
        })
        .then((res) => {
          return {
            list: res.data.data || [],
            total: res.data.total_nums || 0
          };
        });
    },
    {
      reloadDeps: [currentListLayout, auditResultActiveKey, orderStatus],
      isNoMore: (d) => {
        return d ? (d.list.length % 20 > 0 ? true : false) : false;
      }
    }
  );

  const loadMore = () => {
    next && next();
  };

  return (
    <>
      <FileModeHeader />

      <InfiniteScroll
        hasMore={!noMore}
        next={loadMore}
        loader={null}
        dataLength={currentAuditTaskInfiniteList?.list?.length || 0}
        scrollableTarget="test-wrap"
      >
        <List
          className="file-execute-mode-list-wrapper"
          bordered={false}
          itemLayout="vertical"
          loading={loadingMore || scrollLoading}
          split={false}
          dataSource={currentAuditTaskInfiniteList?.list}
          renderItem={(item) => {
            return (
              <List.Item key={item.exec_order}>
                <ResultCard
                  {...item}
                  executeMode={WorkflowResV2ExecModeEnum.sql_file}
                  projectID={projectID}
                  taskId={taskId}
                />
              </List.Item>
            );
          }}
          pagination={false}
        />
      </InfiniteScroll>
    </>
  );
};

export default FileExecuteMode;
