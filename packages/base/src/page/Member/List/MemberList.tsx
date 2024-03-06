import { useMemo, useEffect, useCallback } from 'react';
import { message } from 'antd';
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
import { IListMember } from '@actiontech/shared/lib/api/base/service/common';
import { IListMembersParams } from '@actiontech/shared/lib/api/base/service/dms/index.d';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import { ModalName } from '../../../data/ModalName';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import { MemberListColumns, MemberListActions } from './column';
import {
  updateMemberModalStatus,
  updateSelectMember
} from '../../../store/member';

const MemberList: React.FC = () => {
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

  const { pagination, tableChange } = useTableRequestParams<
    IListMember,
    IListMembersParams
  >();

  const {
    data: memberList,
    loading,
    refresh
  } = useRequest(
    () => {
      const params: IListMembersParams = {
        ...pagination,
        project_uid: projectID
      };
      return handleTableRequestError(dms.ListMembers(params));
    },
    {
      refreshDeps: [pagination, refreshFlag, projectID]
    }
  );

  const onEditMember = useCallback(
    (record?: IListMember) => {
      dispatch(updateSelectMember({ member: record ?? null }));
      dispatch(
        updateMemberModalStatus({
          modalName: ModalName.DMS_Update_Member,
          status: true
        })
      );
    },
    [dispatch, actionPermission]
  );

  const onDeleteMember = useCallback(
    async (record?: IListMember) => {
      const res = await dms.DelMember({
        member_uid: record?.uid ?? '',
        project_uid: projectID
      });

      if (res.data.code === ResponseCode.SUCCESS) {
        messageApi.success(
          t('dmsMember.memberList.deleteSuccessTips', {
            name: record?.user?.name ?? ''
          })
        );
        refresh();
      }
    },
    [messageApi, refresh, t, projectID, actionPermission]
  );

  const actions = useMemo(() => {
    return MemberListActions(onEditMember, onDeleteMember);
  }, [onEditMember, onDeleteMember]);

  useEffect(() => {
    const { unsubscribe } = EventEmitter.subscribe(
      EmitterKey.DMS_Refresh_Member_List,
      toggleRefreshFlag
    );

    return unsubscribe;
  }, [toggleRefreshFlag]);

  return (
    <>
      {contextHolder}
      <ActiontechTable
        rowKey="uid"
        dataSource={memberList?.list}
        pagination={{
          total: memberList?.total ?? 0
        }}
        loading={loading}
        columns={MemberListColumns}
        errorMessage={requestErrorMessage}
        onChange={tableChange}
        actions={!projectArchive && actionPermission ? actions : undefined}
      />
    </>
  );
};

export default MemberList;
