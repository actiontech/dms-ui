import { useMemo, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useRequest } from 'ahooks';
import {
  ActiontechTable,
  useTableRequestError,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import server from '@actiontech/shared/lib/api/diagnosis/service/server';
import { ModalName } from '../../../../data/ModalName';
import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import { ServerMonitorActions, ServerMonitorColumns } from './column';
import {
  updateMonitorSourceConfigModalStatus,
  updateSelectServerMonitorData
} from '../../../../store/monitorSourceConfig';
import { IServerMonitorProps } from './index.type';
import { IViewServerReply } from '@actiontech/shared/lib/api/diagnosis/service/common';
import { IV1ListServersParams } from '@actiontech/shared/lib/api/diagnosis/service/server/index.d';
import ServerMonitorModal from './components/Modal';

const ServerMonitor: React.FC<IServerMonitorProps> = (props) => {
  const dispatch = useDispatch();

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const { pagination, tableChange } = useTableRequestParams<
    IViewServerReply,
    IV1ListServersParams
  >();

  const {
    data: serverMonitorList,
    loading,
    refresh
  } = useRequest(
    () => {
      const params: IV1ListServersParams = {
        ...pagination,
        fuzzy_search_keyword: props.searchValue
      };
      return handleTableRequestError(server.V1ListServers(params));
    },
    {
      refreshDeps: [pagination, props.searchValue]
    }
  );

  useEffect(() => {
    props?.setLoading?.(loading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const onEditServerMonitor = useCallback(
    (record: IViewServerReply | undefined) => {
      if (record) {
        dispatch(updateSelectServerMonitorData(record));
        dispatch(
          updateMonitorSourceConfigModalStatus({
            modalName: ModalName.Update_Server_Monitor,
            status: true
          })
        );
      }
    },
    [dispatch]
  );

  const actions = useMemo(() => {
    return ServerMonitorActions(onEditServerMonitor);
  }, [onEditServerMonitor]);

  const columns = useMemo(() => {
    return ServerMonitorColumns;
  }, []);

  useEffect(() => {
    const { unsubscribe } = EventEmitter.subscribe(
      EmitterKey.Refresh_Server_Monitor,
      refresh
    );

    return unsubscribe;
  }, [refresh]);

  return (
    <>
      <ActiontechTable
        rowKey="name"
        dataSource={serverMonitorList?.list ?? []}
        pagination={{
          total: serverMonitorList?.total ?? 0
        }}
        loading={loading}
        columns={columns}
        errorMessage={requestErrorMessage}
        onChange={tableChange}
        actions={actions}
      />
      <ServerMonitorModal />
    </>
  );
};

export default ServerMonitor;
