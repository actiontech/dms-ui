import { ReactNode } from 'react';
import { UserCenterListEnum } from './index.enum';
import {
  PERMISSIONS,
  PermissionControl
} from '@actiontech/shared/lib/features';
import { ActionButton } from '@actiontech/shared';
import { t } from '../../locale';
import { ModalName } from '../../data/ModalName';
import { PlusOutlined } from '@actiontech/icons';
export const UserCenterPageHeaderActions = (
  activePage: UserCenterListEnum,
  handleClick: (modalName: ModalName) => void
): Record<'add_user' | 'add_role', ReactNode> => {
  return {
    add_user: (
      <PermissionControl
        permission={PERMISSIONS.ACTIONS.BASE.USER_CENTER.USER.ADD}
      >
        <ActionButton
          type="primary"
          text={t('dmsUserCenter.user.userList.addUserButton')}
          onClick={() => {
            handleClick(ModalName.DMS_Add_User);
          }}
          hidden={activePage !== UserCenterListEnum.user_list}
          icon={
            <PlusOutlined
              width={10}
              height={10}
              fill="currentColor"
              color="currentColor"
            />
          }
        />
      </PermissionControl>
    ),
    add_role: (
      <PermissionControl
        permission={PERMISSIONS.ACTIONS.BASE.USER_CENTER.ROLE.ADD}
      >
        <ActionButton
          type="primary"
          text={t('dmsUserCenter.role.createRole.button')}
          onClick={() => {
            handleClick(ModalName.DMS_Add_Role);
          }}
          hidden={activePage !== UserCenterListEnum.role_list}
          icon={
            <PlusOutlined
              width={10}
              height={10}
              fill="currentColor"
              color="currentColor"
            />
          }
        />
      </PermissionControl>
    )
  };
};
