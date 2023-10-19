import { DataSourceResultWaterfallListProps } from '../index.type';
import ResultCard from './components/ResultCard';
import { DataSourceResultListStyleWrapper } from '../style';
import { List } from 'antd5';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useCurrentProject } from '@actiontech/shared/lib/global';

const DataSourceWaterfallList: React.FC<DataSourceResultWaterfallListProps> = ({
  loading,
  list,
  hasMore,
  taskId,
  next,
  scrollPage,
  refreshScrollList
}) => {
  const { projectName } = useCurrentProject();

  const loadMore = () => {
    next && next();
  };

  const onUpdateDescription = (number: number, index: number) => {
    let currentPage = 1;
    for (let i = 2; i <= scrollPage; i++) {
      if (index < i * 20 && index > i * 20 - 20) {
        currentPage = i;
      }
    }
    refreshScrollList(number, currentPage);
  };

  return (
    <DataSourceResultListStyleWrapper className="data-source-result-scroll-infinite-list">
      <InfiniteScroll
        hasMore={!hasMore}
        next={loadMore}
        loader={null}
        dataLength={list?.length || 0}
      >
        <List
          bordered={false}
          itemLayout="vertical"
          loading={loading}
          split={false}
          dataSource={list}
          renderItem={(item, index) => {
            return (
              <List.Item key={item.number}>
                <ResultCard
                  {...item}
                  projectName={projectName}
                  taskId={taskId}
                  onUpdateDescription={() => {
                    onUpdateDescription(item.number!, index + 1);
                  }}
                />
              </List.Item>
            );
          }}
          pagination={false}
        />
      </InfiniteScroll>
    </DataSourceResultListStyleWrapper>
  );
};

export default DataSourceWaterfallList;
