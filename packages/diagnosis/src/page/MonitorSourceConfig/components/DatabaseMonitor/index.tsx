import React, { useCallback, useEffect, useMemo } from 'react';
import {
  ActiontechTable,
  useTableRequestError,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import { useDispatch } from 'react-redux';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { useRequest, useToggle } from 'ahooks';
import db from '@actiontech/shared/lib/api/diagnosis/service/db';
import { IV1ListMonitorDBsParams } from '@actiontech/shared/lib/api/diagnosis/service/db/index.d';
import { IViewDatabaseReply } from '@actiontech/shared/lib/api/diagnosis/service/common';
import { ModalName } from '../../../../data/ModalName';
import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import { DatabaseMonitorActions, DatabaseMonitorColumns } from './column';
import {
  updateMonitorSourceConfigModalStatus,
  updateSelectDatabaseMonitorData
} from '../../../../store/monitorSourceConfig';

interface IDatabaseMonitorProps {
  setLoading: (loading: boolean) => void;
  searchValue: string;
}
const DatabaseMonitor: React.FC<IDatabaseMonitorProps> = (props) => {
  const dispatch = useDispatch();

  const { projectID, projectArchive } = useCurrentProject();

  const [refreshFlag, { toggle: toggleRefreshFlag }] = useToggle(false);

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const { pagination, tableChange } = useTableRequestParams<
    IViewDatabaseReply,
    IV1ListMonitorDBsParams
  >();

  const { data: databaseMonitorList, loading } = useRequest(
    () => {
      const params: IV1ListMonitorDBsParams = {
        ...pagination,
        project_uid: projectID,
        fuzzy_search_keyword: props.searchValue
      };
      return handleTableRequestError(db.V1ListMonitorDBs(params));
    },
    {
      refreshDeps: [pagination, refreshFlag, projectID, props.searchValue]
    }
  );

  useEffect(() => {
    props.setLoading(loading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const onEditDatabaseMonitor = useCallback(
    (record: IViewDatabaseReply | undefined) => {
      if (record) {
        dispatch(updateSelectDatabaseMonitorData(record));
        dispatch(
          updateMonitorSourceConfigModalStatus({
            modalName: ModalName.Update_Database_Monitor,
            status: true
          })
        );
      }
    },
    [dispatch]
  );

  const actions = useMemo(() => {
    return DatabaseMonitorActions(onEditDatabaseMonitor);
  }, [onEditDatabaseMonitor]);

  const columns = useMemo(() => {
    return DatabaseMonitorColumns;
  }, []);

  useEffect(() => {
    const { unsubscribe } = EventEmitter.subscribe(
      EmitterKey.Refresh_Database_Monitor,
      toggleRefreshFlag
    );

    return unsubscribe;
  }, [toggleRefreshFlag]);

  return (
    <>
      <ActiontechTable
        rowKey={(record: IViewDatabaseReply) => {
          return `${record?.createdAt}-${record.host}`;
        }}
        dataSource={databaseMonitorList?.list}
        pagination={{
          total: databaseMonitorList?.total ?? 0
        }}
        loading={loading}
        columns={columns}
        errorMessage={requestErrorMessage}
        onChange={tableChange}
        actions={!projectArchive ? actions : undefined}
      />
    </>
  );
};

export default DatabaseMonitor;
