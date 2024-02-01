import { List, Result } from 'antd';
import useDataExportDetailReduxManage from '../../../hooks/index.redux';
import { useRequest } from 'ahooks';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import {
  useTableRequestError,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { useTranslation } from 'react-i18next';
import ResultCard from './ResultCard';
import { ExportTaskListStyleWrapper } from '../style';

const ExportTaskList: React.FC = () => {
  const { t } = useTranslation();
  const { projectID } = useCurrentProject();
  const { pagination } = useTableRequestParams();
  const { curTaskID } = useDataExportDetailReduxManage();
  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const { loading, data: taskInfo } = useRequest(
    () =>
      handleTableRequestError(
        dms.ListDataExportTaskSQLs({
          project_uid: projectID,
          data_export_task_uid: curTaskID!,
          ...pagination
        })
      ),
    {
      ready: !!curTaskID,
      refreshDeps: [curTaskID]
    }
  );
  return (
    <ExportTaskListStyleWrapper>
      <List
        bordered={false}
        itemLayout="vertical"
        loading={loading}
        split={false}
        dataSource={taskInfo?.list}
        locale={{
          emptyText: requestErrorMessage ? (
            <Result
              status="error"
              title={t('common.request.noticeFailTitle')}
              subTitle={requestErrorMessage}
            />
          ) : undefined
        }}
        renderItem={(item) => {
          return (
            <List.Item key={item.uid}>
              <ResultCard {...item} taskID={curTaskID!} />
            </List.Item>
          );
        }}
        pagination={{
          className:
            'result-list-pagination data-source-result-list-pagination',
          showSizeChanger: true,
          defaultPageSize: 20,
          total: taskInfo?.total,
          pageSize: pagination.page_size,
          current: pagination.page_index,
          showTotal: (total) => (
            <span>
              {t('common.actiontechTable.pagination.total', {
                total
              })}
            </span>
          )
        }}
      />
    </ExportTaskListStyleWrapper>
  );
};

export default ExportTaskList;
