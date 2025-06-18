import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import MemberModals from './Modals';
import { Space } from 'antd';
import {
  PageHeader,
  SegmentedTabs,
  SegmentedTabsProps
} from '@actiontech/shared';
import { ProjectMemberStyleWrapper } from './style';
import { MemberListTypeEnum } from './index.enum';
import MemberList from './List/MemberList';
import MemberGroupList from './List/MemberGroupList';
import { updateMemberModalStatus } from '../../store/member';
import { ModalName } from '../../data/ModalName';
import { TableRefreshButton } from '@actiontech/shared/lib/components/ActiontechTable';
import EventEmitter from '../../utils/EventEmitter';
import EmitterKey from '../../data/EmitterKey';
import { MemberListPageHeaderActions } from './actions';

const Member: React.FC = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

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

    const pageHeaderActions = MemberListPageHeaderActions(
      handleClick,
      activePage
    );

    return (
      <>
        {pageHeaderActions['add-member']}
        {pageHeaderActions['add-member-group']}
      </>
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
      <MemberModals />
    </ProjectMemberStyleWrapper>
  );
};

export default Member;
