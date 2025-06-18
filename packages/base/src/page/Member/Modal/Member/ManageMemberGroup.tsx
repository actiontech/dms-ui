import { useCallback, useEffect } from 'react';
import { message, Space, Spin, Popconfirm } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useRequest } from 'ahooks';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { BasicButton, BasicModal, BasicTag } from '@actiontech/shared';
import { IReduxState } from '../../../../store';
import {
  updateMemberModalStatus,
  updateSelectMemberGroup
} from '../../../../store/member';
import { ModalName } from '../../../../data/ModalName';
import MemberGroup from '@actiontech/shared/lib/api/base/service/MemberGroup';
import { IListMemberGroup } from '@actiontech/shared/lib/api/base/service/common';
import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import formatMemberRole from '../../Common/formatMemberRole';
import { ManageMemberGroupContainer, MemberGroupCard } from './style';
import { BasicEmpty } from '@actiontech/shared';

const ManageMemberGroup: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const { projectID } = useCurrentProject();

  const { visible, selectMember } = useSelector((state: IReduxState) => ({
    visible: state.member.modalStatus[ModalName.DMS_Manage_Member_Group],
    selectMember: state.member.selectMember
  }));

  const {
    data: memberGroups,
    loading,
    run: fetchMemberGroups
  } = useRequest(
    async () => {
      return MemberGroup.ListMemberGroups({
        page_size: 1000,
        project_uid: projectID
      }).then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          return (res.data.data || []).filter((group) =>
            group.users?.some((user) => user.uid === selectMember?.user?.uid)
          );
        }
      });
    },
    {
      manual: true
    }
  );

  useEffect(() => {
    if (visible && selectMember?.user?.uid) {
      fetchMemberGroups();
    }
  }, [visible, selectMember?.user?.uid, fetchMemberGroups]);

  const onClose = useCallback(() => {
    dispatch(
      updateMemberModalStatus({
        modalName: ModalName.DMS_Manage_Member_Group,
        status: false
      })
    );
  }, [dispatch]);

  const handleEditPermissions = useCallback(
    (memberGroup: IListMemberGroup) => {
      dispatch(
        updateMemberModalStatus({
          modalName: ModalName.DMS_Update_Member_Group,
          status: true
        })
      );
      dispatch(
        updateSelectMemberGroup({
          memberGroup
        })
      );
      onClose();
    },
    [dispatch, onClose]
  );

  const handleExitGroup = useCallback(
    (memberGroup: IListMemberGroup) => {
      if (!selectMember?.user?.uid || !memberGroup.uid) return;

      const updatedUserUids = (memberGroup.users || [])
        .filter((user) => user.uid !== selectMember.user?.uid)
        .map((user) => user.uid!);

      MemberGroup.UpdateMemberGroup({
        member_group_uid: memberGroup.uid,
        project_uid: projectID,
        member_group: {
          is_project_admin: memberGroup.is_project_admin,
          role_with_op_ranges: formatMemberRole(
            memberGroup.role_with_op_ranges || []
          ),
          user_uids: updatedUserUids
        }
      }).then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t('dmsMember.manageMemberGroup.exitGroupSuccess', {
              name: memberGroup.name
            })
          );
          fetchMemberGroups();
          EventEmitter.emit(EmitterKey.DMS_Refresh_Member_List);
        }
      });
    },
    [selectMember?.user?.uid, projectID, messageApi, fetchMemberGroups, t]
  );

  const renderPermissions = useCallback((roleWithOpRanges: any[] = []) => {
    if (!roleWithOpRanges || roleWithOpRanges.length === 0) {
      return '-';
    }

    return roleWithOpRanges.map((item, index) => (
      <BasicTag size="small" key={index} color="gray">
        {item.role_uid?.name}
      </BasicTag>
    ));
  }, []);

  const renderMemberGroup = useCallback(
    (group: IListMemberGroup) => (
      <MemberGroupCard key={group.uid}>
        <div className="member-group-header">
          <div className="member-group-content">
            <h4 className="member-group-title">{group.name}</h4>
            <div className="permissions-container">
              {renderPermissions(group.role_with_op_ranges)}
            </div>
          </div>
          <Space className="action-buttons">
            <BasicButton
              size="small"
              onClick={() => handleEditPermissions(group)}
            >
              {t('dmsMember.manageMemberGroup.editPermissions')}
            </BasicButton>
            <Popconfirm
              title={t('dmsMember.manageMemberGroup.exitGroupConfirmTitle', {
                groupName: group.name
              })}
              onConfirm={() => handleExitGroup(group)}
              okText={t('common.ok')}
              cancelText={t('common.cancel')}
            >
              <BasicButton size="small" danger>
                {t('dmsMember.manageMemberGroup.exitGroup')}
              </BasicButton>
            </Popconfirm>
          </Space>
        </div>
      </MemberGroupCard>
    ),
    [handleEditPermissions, handleExitGroup, renderPermissions, t]
  );

  return (
    <BasicModal
      open={visible}
      title={t('dmsMember.manageMemberGroup.modalTitle')}
      onCancel={onClose}
      footer={<BasicButton onClick={onClose}>{t('common.close')}</BasicButton>}
      width={600}
    >
      {contextHolder}
      <Spin spinning={loading}>
        <ManageMemberGroupContainer>
          {memberGroups && memberGroups.length > 0 ? (
            memberGroups.map(renderMemberGroup)
          ) : (
            <BasicEmpty
              emptyCont={t('dmsMember.manageMemberGroup.emptyGroup')}
            />
          )}
        </ManageMemberGroupContainer>
      </Spin>
    </BasicModal>
  );
};

export default ManageMemberGroup;
