import { useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import MemberModal from './Modal';
import { Space } from 'antd';
import { BasicButton, PageHeader, EmptyBox } from '@actiontech/shared';
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
import {
  BasicSegmentedPage,
  useSegmentedPageParams
} from '@actiontech/shared/lib/components/BasicSegmentedPage';

const Member: React.FC = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const { projectArchive, projectName } = useCurrentProject();

  const { isAdmin, isProjectManager } = useCurrentUser();

  const actionPermission = useMemo(() => {
    return isAdmin || isProjectManager(projectName);
  }, [isAdmin, isProjectManager, projectName]);

  const { updateSegmentedPageData, renderExtraButton, ...otherProps } =
    useSegmentedPageParams<MemberListTypeEnum>();

  const onRefreshTable = () => {
    EventEmitter.emit(EmitterKey.DMS_Refresh_Member_List);
  };

  useEffect(() => {
    const onOpenMemberModal = (modalName: ModalName) => {
      dispatch(
        updateMemberModalStatus({
          modalName,
          status: true
        })
      );
    };

    const buttonRender = (text: React.ReactNode, modalName: ModalName) => (
      <EmptyBox if={!projectArchive && actionPermission}>
        <BasicButton
          onClick={() => onOpenMemberModal(modalName)}
          type="primary"
          icon={<IconAdd />}
        >
          {text}
        </BasicButton>
      </EmptyBox>
    );

    updateSegmentedPageData([
      {
        value: MemberListTypeEnum.member_list,
        label: t('dmsMember.memberList.title'),
        content: <MemberList />,
        extraButton: buttonRender(
          t('dmsMember.addMember.modalTitle'),
          ModalName.DMS_Add_Member
        )
      },
      {
        value: MemberListTypeEnum.member_group_list,
        label: t('dmsMember.memberGroupList.title'),
        content: <MemberGroupList />,
        extraButton: buttonRender(
          t('dmsMember.addMemberGroup.modalTitle'),
          ModalName.DMS_Add_Member_Group
        )
      }
    ]);
  }, [updateSegmentedPageData, t, actionPermission, dispatch, projectArchive]);

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
      <BasicSegmentedPage {...otherProps} />
      <MemberModal />
    </ProjectMemberStyleWrapper>
  );
};

export default Member;
