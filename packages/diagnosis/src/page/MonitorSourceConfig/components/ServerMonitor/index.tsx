import { useMemo, useEffect, useCallback } from 'react';
import { useRequest } from 'ahooks';
import {
  ActiontechTable,
  useTableRequestError,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import server from '../../../../api/server';
import { ModalName } from '../../../../data/ModalName';
import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import { ServerMonitorActions, ServerMonitorColumns } from './column';
import { IServerMonitorProps } from './index.type';
import { IViewServerReply } from '../../../../api/common';
import { IV1ListServersParams } from '../../../../api/server/index.d';
import ServerMonitorModal from './components/Modal';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';
import useMonitorSourceConfigRedux from '../../hooks/useMonitorSourceConfigRedux';

const ServerMonitor: React.FC<IServerMonitorProps> = (props) => {
  const { t } = useTranslation();

  const { setModalStatus, setServerSelectData } = useMonitorSourceConfigRedux();

  const [messageApi, messageContextHolder] = message.useMessage();

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
      refreshDeps: [pagination]
    }
  );

  useEffect(() => {
    props?.setLoading?.(loading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const onEditServerMonitor = useCallback(
    (record: IViewServerReply | undefined) => {
      if (record) {
        setServerSelectData(record);
        setModalStatus(ModalName.Update_Server_Monitor, true);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const onDeleteServerMonitor = useCallback(
    (id?: string, name?: string) => {
      if (!id) return;
      const hideLoading = messageApi.loading(
        t(
          'monitorSourceConfig.serverMonitor.deleteServerMonitorSourceLoading',
          {
            name
          }
        ),
        0
      );
      server
        .V1DeleteServer({
          server_ids: [id]
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            messageApi.success(
              t(
                'monitorSourceConfig.serverMonitor.deleteServerMonitorSourceTip',
                {
                  name
                }
              )
            );
            refresh();
          }
        })
        .finally(() => {
          hideLoading();
        });
    },
    [refresh, t, messageApi]
  );

  const actions = useMemo(() => {
    return ServerMonitorActions(onEditServerMonitor, onDeleteServerMonitor);
  }, [onEditServerMonitor, onDeleteServerMonitor]);

  useEffect(() => {
    const { unsubscribe } = EventEmitter.subscribe(
      EmitterKey.Refresh_Server_Monitor,
      refresh
    );

    return unsubscribe;
  }, [refresh]);

  return (
    <>
      {messageContextHolder}
      <ActiontechTable
        rowKey="name"
        dataSource={serverMonitorList?.list ?? []}
        pagination={{
          total: serverMonitorList?.total ?? 0,
          current: pagination.page_index
        }}
        loading={loading}
        columns={ServerMonitorColumns()}
        errorMessage={requestErrorMessage}
        onChange={tableChange}
        actions={actions}
      />
      <ServerMonitorModal />
    </>
  );
};

export default ServerMonitor;
