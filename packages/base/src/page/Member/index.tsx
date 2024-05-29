import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import MemberModal from './Modal';
import { Space } from 'antd';
import {
  BasicButton,
  PageHeader,
  EmptyBox,
  SegmentedTabs
} from '@actiontech/shared';
import { IconAdd } from '@actiontech/shared/lib/Icon';
import { ProjectMemberStyleWrapper } from './style';
import { MemberListTypeEnum } from './index.enum';
import MemberList from './List/MemberList';
import MemberGroupList from './List/MemberGroupList';
import { updateMemberModalStatus } from '../../store/member';
import { ModalName } from '../../data/ModalName';
import { TableRefreshButton } from '@actiontech/shared/lib/components/ActiontechTable';
import EventEmitter from '../../utils/EventEmitter';
import EmitterKey from '../../data/EmitterKey';
import {
  useCurrentProject,
  useCurrentUser
} from '@actiontech/shared/lib/global';
import { SegmentedTabsProps } from '@actiontech/shared/lib/components/SegmentedTabs/index.type';

const Member: React.FC = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const { projectArchive, projectName } = useCurrentProject();

  const { isAdmin, isProjectManager } = useCurrentUser();

  const actionPermission = useMemo(() => {
    return isAdmin || isProjectManager(projectName);
  }, [isAdmin, isProjectManager, projectName]);

  const [activePage, setActivePage] = useState(MemberListTypeEnum.member_list);

  const onRefreshTable = () => {
    EventEmitter.emit(EmitterKey.DMS_Refresh_Member_List);
  };

  const pageItems: SegmentedTabsProps['items'] = [
    {
      value: MemberListTypeEnum.member_list,
      label: t('dmsMember.memberList.title'),
      children: <MemberList activePage={activePage} />
    },
    {
      value: MemberListTypeEnum.member_group_list,
      label: t('dmsMember.memberGroupList.title'),
      children: <MemberGroupList activePage={activePage} />
    }
  ];

  const renderExtraButton = () => {
    const handleClick = (modalName: ModalName) => {
      dispatch(
        updateMemberModalStatus({
          modalName,
          status: true
        })
      );
    };

    return (
      <EmptyBox if={!projectArchive && actionPermission}>
        <BasicButton
          hidden={activePage !== MemberListTypeEnum.member_list}
          type="primary"
          icon={<IconAdd />}
          onClick={() => {
            handleClick(ModalName.DMS_Add_Member);
          }}
        >
          {t('dmsMember.addMember.modalTitle')}
        </BasicButton>

        <BasicButton
          hidden={activePage !== MemberListTypeEnum.member_group_list}
          type="primary"
          icon={<IconAdd />}
          onClick={() => {
            handleClick(ModalName.DMS_Add_Member_Group);
          }}
        >
          {t('dmsMember.addMemberGroup.modalTitle')}
        </BasicButton>
      </EmptyBox>
    );
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
        extra={renderExtraButton()}
      />
      <SegmentedTabs
        items={pageItems}
        activeKey={activePage}
        onChange={setActivePage}
      />
      <MemberModal />
    </ProjectMemberStyleWrapper>
  );
};

export default Member;
