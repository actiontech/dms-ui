import { useMemo, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  ActiontechTable,
  useTableRequestError,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import { ActiontechTableActionMeta } from '@actiontech/shared/lib/components/ActiontechTable/index.type';
import {
  useCurrentProject,
  useCurrentUser
} from '@actiontech/shared/lib/global';
import { useRequest } from 'ahooks';
import { IListMemberGroup } from '@actiontech/shared/lib/api/base/service/common';
import { IListMemberGroupsParams } from '@actiontech/shared/lib/api/base/service/dms/index.d';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import { MemberGroupListColumns, MemberGroupListActions } from './column';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import {
  updateMemberModalStatus,
  updateSelectMemberGroup
} from '../../../store/member';
import { ModalName } from '../../../data/ModalName';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import { MemberListTypeEnum } from '../index.enum';

const MemberList: React.FC<{ activePage: MemberListTypeEnum }> = ({
  activePage
}) => {
  const { t } = useTranslation();

  const [messageApi, contextHolder] = message.useMessage();

  const dispatch = useDispatch();

  const { projectID, projectArchive, projectName } = useCurrentProject();

  const { isAdmin, isProjectManager } = useCurrentUser();

  const actionPermission = useMemo(() => {
    return isAdmin || isProjectManager(projectName);
  }, [isAdmin, isProjectManager, projectName]);

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const { pagination, tableChange } = useTableRequestParams<
    IListMemberGroup,
    IListMemberGroupsParams
  >();

  const {
    data: memberList,
    loading,
    refresh
  } = useRequest(
    () => {
      const params: IListMemberGroupsParams = {
        ...pagination,
        project_uid: projectID
      };
      return handleTableRequestError(dms.ListMemberGroups(params));
    },
    {
      refreshDeps: [pagination, activePage],
      ready: activePage === MemberListTypeEnum.member_group_list
    }
  );

  const onEditMemberGroup = useCallback(
    (record?: IListMemberGroup) => {
      dispatch(updateSelectMemberGroup({ memberGroup: record ?? null }));
      dispatch(
        updateMemberModalStatus({
          modalName: ModalName.DMS_Update_Member_Group,
          status: true
        })
      );
    },
    [dispatch]
  );

  const onDeleteMemberGroup = useCallback(
    async (record?: IListMemberGroup) => {
      const res = await dms.DeleteMemberGroup({
        member_group_uid: record?.uid ?? '',
        project_uid: projectID
      });

      if (res.data.code === ResponseCode.SUCCESS) {
        messageApi.success(
          t('dmsMember.memberGroupList.deleteSuccessTips', {
            name: record?.name ?? ''
          })
        );
        refresh();
      }
    },
    [messageApi, refresh, t, projectID]
  );

  const memberGroupListActions = useMemo<
    ActiontechTableActionMeta<IListMemberGroup>[]
  >(() => {
    return MemberGroupListActions(onEditMemberGroup, onDeleteMemberGroup);
  }, [onEditMemberGroup, onDeleteMemberGroup]);

  useEffect(() => {
    const { unsubscribe } = EventEmitter.subscribe(
      EmitterKey.DMS_Refresh_Member_List,
      refresh
    );

    return unsubscribe;
  }, [refresh]);

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
        columns={MemberGroupListColumns}
        errorMessage={requestErrorMessage}
        onChange={tableChange}
        actions={
          !projectArchive && actionPermission
            ? memberGroupListActions
            : undefined
        }
      />
    </>
  );
};

export default MemberList;
