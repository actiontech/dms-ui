import React, { useCallback, useEffect, useMemo } from 'react';
import {
  ActiontechTable,
  useTableRequestError,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import { useRequest } from 'ahooks';
import db from '../../../../api/db';
import { IV1ListMonitorDBsParams } from '../../../../api/db/index.d';
import { IViewDatabaseReply } from '../../../../api/common';
import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import { DatabaseMonitorActions, DatabaseMonitorColumns } from './column';
import DatabaseMonitorModal from './components/Modal';
import { message } from 'antd';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useTranslation } from 'react-i18next';

interface IDatabaseMonitorProps {
  setLoading: (loading: boolean) => void;
  searchValue: string;
}
const DatabaseMonitor: React.FC<IDatabaseMonitorProps> = (props) => {
  const { t } = useTranslation();

  const [messageApi, contextHolder] = message.useMessage();

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
        fuzzy_search_keyword: props.searchValue
      };
      return handleTableRequestError(db.V1ListMonitorDBs(params));
    },
    {
      refreshDeps: [pagination]
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
        db_monitor_ids: [record?.monitor_name as unknown as number]
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
    [refresh, t, messageApi]
  );

  const actions = useMemo(() => {
    return DatabaseMonitorActions(deleteDatabaseMonitor);
  }, [deleteDatabaseMonitor]);

  const columns = useMemo(() => {
    return DatabaseMonitorColumns();
  }, []);

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
          total: databaseMonitorList?.total ?? 0,
          current: pagination.page_index
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
