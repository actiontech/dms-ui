import React, { useCallback, useEffect, useMemo } from 'react';
import {
  ActiontechTable,
  useTableRequestError,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { useRequest } from 'ahooks';
import db from '@actiontech/shared/lib/api/diagnosis/service/db';
import { IV1ListMonitorDBsParams } from '@actiontech/shared/lib/api/diagnosis/service/db/index.d';
import { IViewDatabaseReply } from '@actiontech/shared/lib/api/diagnosis/service/common';
import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import { DatabaseMonitorActions, DatabaseMonitorColumns } from './column';
import DatabaseMonitorModal from './components/Modal';
import { message } from 'antd5';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useTranslation } from 'react-i18next';

interface IDatabaseMonitorProps {
  setLoading: (loading: boolean) => void;
  searchValue: string;
}
const DatabaseMonitor: React.FC<IDatabaseMonitorProps> = (props) => {
  const { t } = useTranslation();

  const [messageApi, contextHolder] = message.useMessage();

  const { projectID } = useCurrentProject();

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const { pagination, tableChange } = useTableRequestParams<
    IViewDatabaseReply,
    IV1ListMonitorDBsParams
  >();

  const {
    data: databaseMonitorList,
    loading,
    refresh
  } = useRequest(
    () => {
      const params: IV1ListMonitorDBsParams = {
        ...pagination,
        project_uid: projectID,
        fuzzy_search_keyword: props.searchValue
      };
      return handleTableRequestError(db.V1ListMonitorDBs(params));
    },
    {
      refreshDeps: [pagination, projectID, props.searchValue]
    }
  );

  useEffect(() => {
    props.setLoading(loading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const deleteDatabaseMonitor = useCallback(
    (record?: IViewDatabaseReply) => {
      if (!record) return;
      db.V1DeleteDB({
        project_uid: projectID,
        db_monitor_names: [record?.monitor_name]
      }).then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.open({
            type: 'success',
            content: t(
              'monitorSourceConfig.databaseMonitor.deleteDatabaseMonitorSourceTip',
              {
                name: record?.monitor_name
              }
            )
          });
          refresh();
        }
      });
    },
    [refresh, t, messageApi, projectID]
  );

  const actions = useMemo(() => {
    return DatabaseMonitorActions(deleteDatabaseMonitor);
  }, [deleteDatabaseMonitor]);

  const columns = useMemo(() => {
    return DatabaseMonitorColumns(projectID);
  }, [projectID]);

  useEffect(() => {
    const { unsubscribe } = EventEmitter.subscribe(
      EmitterKey.Refresh_Database_Monitor,
      refresh
    );

    return unsubscribe;
  }, [refresh]);

  return (
    <>
      {contextHolder}
      <ActiontechTable
        rowKey={(record: IViewDatabaseReply) => {
          return `${record?.created_at}-${record.host}`;
        }}
        dataSource={databaseMonitorList?.list}
        pagination={{
          total: databaseMonitorList?.total ?? 0
        }}
        loading={loading}
        columns={columns}
        errorMessage={requestErrorMessage}
        onChange={tableChange}
        actions={actions}
      />
      <DatabaseMonitorModal />
    </>
  );
};

export default DatabaseMonitor;
