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
  usePermission
} from '@actiontech/shared/lib/features';
import { ResponseCode } from '@actiontech/dms-kit';
import { IListMember } from '@actiontech/shared/lib/api/base/service/common';
import { IListMembersParams } from '@actiontech/shared/lib/api/base/service/Member/index.d';
import Member from '@actiontech/shared/lib/api/base/service/Member';
import { ModalName } from '../../../data/ModalName';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import { MemberListColumns } from './column';
import {
  updateMemberModalStatus,
  updateSelectMember
} from '../../../store/member';
import { MemberListTypeEnum } from '../index.enum';
import { MemberListActions } from './actions';

const MemberList: React.FC<{ activePage: MemberListTypeEnum }> = ({
  activePage
}) => {
  const { t } = useTranslation();

  const [messageApi, contextHolder] = message.useMessage();

  const dispatch = useDispatch();

  const { projectID } = useCurrentProject();

  const { parse2TableActionPermissions } = usePermission();

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
      return handleTableRequestError(Member.ListMembers(params));
    },
    {
      refreshDeps: [pagination, refreshFlag, projectID, activePage],
      ready: activePage === MemberListTypeEnum.member_list
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
    [dispatch]
  );

  const onDeleteMember = useCallback(
    async (record?: IListMember) => {
      const res = await Member.DelMember({
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
    [messageApi, refresh, t, projectID]
  );

  const onManageMemberGroup = useCallback(
    (record?: IListMember) => {
      dispatch(updateSelectMember({ member: record ?? null }));
      dispatch(
        updateMemberModalStatus({
          modalName: ModalName.DMS_Manage_Member_Group,
          status: true
        })
      );
    },
    [dispatch]
  );

  const actions = useMemo(() => {
    return parse2TableActionPermissions(
      MemberListActions(onEditMember, onDeleteMember, onManageMemberGroup)
    );
  }, [
    onEditMember,
    onDeleteMember,
    parse2TableActionPermissions,
    onManageMemberGroup
  ]);

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
        actions={actions}
        scroll={{}}
      />
    </>
  );
};

export default MemberList;
