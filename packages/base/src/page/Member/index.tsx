import { useState, useMemo } from 'react';
import { SegmentedValue } from 'antd5/es/segmented';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import MemberModal from './Modal';
import { Space } from 'antd5';
import {
  BasicButton,
  PageHeader,
  BasicSegmented,
  EmptyBox
} from '@actiontech/shared';
import { IconAdd } from '@actiontech/shared/lib/Icon';
import { ProjectMemberStyleWrapper } from './style';
import { MemberListTypeEnum } from './types';
import MemberList from './components/MemberList';
import MemberGroupList from './components/MemberGroupList';
import { updateMemberModalStatus } from '../../store/member';
import { ModalName } from '../../data/ModalName';
import {
  TableToolbar,
  TableRefreshButton
} from '@actiontech/shared/lib/components/ActiontechTable';
import EventEmitter from '../../utils/EventEmitter';
import EmitterKey from '../../data/EmitterKey';
import {
  useCurrentProject,
  useCurrentUser
} from '@actiontech/shared/lib/global';

const Member: React.FC = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const { projectArchive, projectName } = useCurrentProject();

  const { isAdmin, isProjectManager } = useCurrentUser();

  const actionPermission = useMemo(() => {
    return isAdmin || isProjectManager(projectName);
  }, [isAdmin, isProjectManager, projectName]);

  const [listType, setListType] = useState<MemberListTypeEnum>(
    MemberListTypeEnum.member_list
  );

  const onChange = (key: SegmentedValue) => {
    setListType(key as MemberListTypeEnum);
  };

  const onAddMember = () => {
    if (!actionPermission) {
      return;
    }
    dispatch(
      updateMemberModalStatus({
        modalName: ModalName.DMS_Add_Member,
        status: true
      })
    );
  };

  const onAddMemberGroup = () => {
    if (!actionPermission) {
      return;
    }
    dispatch(
      updateMemberModalStatus({
        modalName: ModalName.DMS_Add_Member_Group,
        status: true
      })
    );
  };

  const renderTable = () => {
    if (listType === MemberListTypeEnum.member_list) {
      return <MemberList />;
    }
    return <MemberGroupList />;
  };

  const onRefreshTable = () => {
    if (listType === MemberListTypeEnum.member_list) {
      EventEmitter.emit(EmitterKey.DMS_Refresh_Member_List);
      return;
    }
    EventEmitter.emit(EmitterKey.DMS_Refresh_Member_Group_List);
  };

  return (
    <ProjectMemberStyleWrapper>
      <PageHeader
        title={
          <Space size={12}>
            {t('dmsMember.pageTitle')}
            <TableRefreshButton refresh={onRefreshTable} />
          </Space>
        }
        extra={
          <EmptyBox if={!projectArchive && actionPermission}>
            <Space size={12}>
              {listType === MemberListTypeEnum.member_list ? (
                <BasicButton
                  onClick={onAddMember}
                  type="primary"
                  icon={<IconAdd />}
                >
                  {t('dmsMember.addMember.modalTitle')}
                </BasicButton>
              ) : (
                <BasicButton
                  onClick={onAddMemberGroup}
                  type="primary"
                  icon={<IconAdd />}
                >
                  {t('dmsMember.addMemberGroup.modalTitle')}
                </BasicButton>
              )}
            </Space>
          </EmptyBox>
        }
      />
      <TableToolbar>
        <BasicSegmented
          value={listType}
          onChange={onChange}
          options={[
            {
              value: MemberListTypeEnum.member_list,
              label: t('dmsMember.memberList.title')
            },
            {
              value: MemberListTypeEnum.member_group_list,
              label: t('dmsMember.memberGroupList.title')
            }
          ]}
        />
      </TableToolbar>
      {renderTable()}
      <MemberModal />
    </ProjectMemberStyleWrapper>
  );
};

export default Member;
