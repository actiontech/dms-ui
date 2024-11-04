import { t } from '../../locale';
import { PERMISSIONS, PermissionControl } from '@actiontech/shared/lib/global';
import { ActionButton } from '@actiontech/shared';
import { PlusOutlined } from '@actiontech/icons';
import { ModalName } from '../../data/ModalName';
import { MemberListTypeEnum } from './index.enum';

export const MemberListPageHeaderActions = (
  onClick: (modalName: ModalName) => void,
  activePage: MemberListTypeEnum
): Record<'add-member' | 'add-member-group', React.ReactNode> => ({
  'add-member': (
    <PermissionControl permission={PERMISSIONS.ACTIONS.BASE.MEMBER.ADD_MEMBER}>
      <ActionButton
        type="primary"
        icon={<PlusOutlined width={10} height={10} color="currentColor" />}
        text={t('dmsMember.addMember.modalTitle')}
        onClick={() => onClick(ModalName.DMS_Add_Member)}
        hidden={activePage !== MemberListTypeEnum.member_list}
      />
    </PermissionControl>
  ),
  'add-member-group': (
    <PermissionControl
      permission={PERMISSIONS.ACTIONS.BASE.MEMBER.ADD_MEMBER_GROUP}
    >
      <ActionButton
        type="primary"
        icon={<PlusOutlined width={10} height={10} color="currentColor" />}
        text={t('dmsMember.addMemberGroup.modalTitle')}
        onClick={() => onClick(ModalName.DMS_Add_Member_Group)}
        hidden={activePage !== MemberListTypeEnum.member_group_list}
      />
    </PermissionControl>
  )
});
