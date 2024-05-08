import { DataSourceResultListProps } from '../index.type';
import ResultCard from './components/ResultCard';
import { DataSourceResultListStyleWrapper } from '../style';
import { List } from 'antd';
import { useTranslation } from 'react-i18next';
import { useCurrentProject } from '@actiontech/shared/lib/global';

const DataSourceResultList: React.FC<DataSourceResultListProps> = ({
  loading,
  onChange,
  total,
  pagination,
  list,
  taskId,
  refresh
}) => {
  const { t } = useTranslation();

  const { projectName } = useCurrentProject();

  return (
    <DataSourceResultListStyleWrapper>
      <List
        bordered={false}
        itemLayout="vertical"
        loading={loading}
        split={false}
        dataSource={list}
        renderItem={(item) => {
          return (
            <List.Item key={item.number}>
              <ResultCard
                {...item}
                projectName={projectName}
                taskId={taskId}
                onUpdateDescription={refresh}
              />
            </List.Item>
          );
        }}
        pagination={{
          className:
            'result-list-pagination data-source-result-list-pagination',
          showSizeChanger: true,
          defaultPageSize: 20,
          total,
          pageSize: pagination.page_size,
          current: pagination.page_index,
          showTotal: (_total) => (
            <span>
              {t('common.actiontechTable.pagination.total', {
                total: _total
              })}
            </span>
          ),
          onChange: (page, pageSize) => {
            onChange &&
              onChange(
                { current: page, pageSize },
                {},
                {},
                { currentDataSource: [], action: 'paginate' }
              );
          }
        }}
      ></List>
    </DataSourceResultListStyleWrapper>
  );
};

export default DataSourceResultList;
