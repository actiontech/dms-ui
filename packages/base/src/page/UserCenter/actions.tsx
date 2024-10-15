import { PlusOutlined } from '@actiontech/icons';
import { ActionButtonProps } from '@actiontech/shared';
import { t } from '../../locale';
import { ModalName } from '../../data/ModalName';
import { UserCenterListEnum } from './index.enum';

export const UserCenterPageHeaderActions = (
  handleClick: (modalName: ModalName) => void,
  activePage: UserCenterListEnum
): Record<'add_user' | 'add_role', ActionButtonProps> => ({
  add_user: {
    type: 'primary',
    text: t('dmsUserCenter.user.userList.addUserButton'),
    onClick: () => {
      handleClick(ModalName.DMS_Add_User);
    },
    hidden: activePage !== UserCenterListEnum.user_list,
    icon: (
      <PlusOutlined
        width={10}
        height={10}
        fill="currentColor"
        color="currentColor"
      />
    )
  },
  add_role: {
    type: 'primary',
    text: t('dmsUserCenter.role.createRole.button'),
    onClick: () => {
      handleClick(ModalName.DMS_Add_Role);
    },
    hidden: activePage !== UserCenterListEnum.role_list,
    icon: (
      <PlusOutlined
        width={10}
        height={10}
        fill="currentColor"
        color="currentColor"
      />
    )
  }
});
