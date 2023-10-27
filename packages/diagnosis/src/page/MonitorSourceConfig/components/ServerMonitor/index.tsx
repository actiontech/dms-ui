import { useMemo, useEffect, useCallback } from 'react';
import { message } from 'antd5';
import { useToggle } from 'ahooks';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useRequest } from 'ahooks';
import {
  ActiontechTable,
  useTableRequestError,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import {
  useCurrentProject,
  useCurrentUser
} from '@actiontech/shared/lib/global';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import { ModalName } from '../../../../data/ModalName';
import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import { ServerMonitorActions, ServerMonitorColumns } from './column';
import {
  updateMonitorSourceConfigModalStatus,
  updateSelectServerMonitorData
} from '../../../../store/monitorSourceConfig';

const ServerMonitor: React.FC = () => {
  const { t } = useTranslation();

  const [messageApi, contextHolder] = message.useMessage();

  const dispatch = useDispatch();

  const { projectID, projectArchive, projectName } = useCurrentProject();

  const { isAdmin, isProjectManager } = useCurrentUser();

  const actionPermission = useMemo(() => {
    return isAdmin || isProjectManager(projectName);
  }, [isAdmin, isProjectManager, projectName]);

  const [refreshFlag, { toggle: toggleRefreshFlag }] = useToggle(false);

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  // const { pagination, tableChange } = useTableRequestParams<
  //   IListMember,
  //   IListMembersParams
  // >();

  // const {
  //   data: serverMonitorList,
  //   loading,
  //   refresh
  // } = useRequest(
  //   () => {
  //     const params: IListMembersParams = {
  //       ...pagination,
  //       project_uid: projectID
  //     };
  //     return handleTableRequestError(dms.ListMembers(params));
  //   },
  //   {
  //     refreshDeps: [pagination, refreshFlag, projectID]
  //   }
  // );

  const onEditServerMonitor = useCallback(
    (record: any | undefined) => {
      dispatch(updateSelectServerMonitorData(record));
      dispatch(
        updateMonitorSourceConfigModalStatus({
          modalName: ModalName.Add_Server_Monitor,
          status: true
        })
      );
    },
    [dispatch, actionPermission]
  );

  const actions = useMemo(() => {
    return ServerMonitorActions(onEditServerMonitor);
  }, [ServerMonitorActions, onEditServerMonitor]);

  const columns = useMemo(() => {
    return ServerMonitorColumns;
  }, []);

  useEffect(() => {
    const { unsubscribe } = EventEmitter.subscribe(
      EmitterKey.Refresh_Server_Monitor,
      toggleRefreshFlag
    );

    return unsubscribe;
  }, [toggleRefreshFlag]);

  return (
    <>
      {contextHolder}
      <ActiontechTable
        rowKey="uid"
        dataSource={[]}
        // dataSource={serverMonitorList?.list}
        pagination={{
          total: 0
          // total: serverMonitorList?.total ?? 0
        }}
        // loading={loading}
        columns={columns}
        errorMessage={requestErrorMessage}
        // onChange={tableChange}
        actions={!projectArchive ? actions : undefined}
      />
    </>
  );
};

export default ServerMonitor;
