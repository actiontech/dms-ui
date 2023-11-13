import {
  IListRole,
  IUidWithName
} from '@actiontech/shared/lib/api/base/service/common';
import {
  ActiontechTableColumn,
  ActiontechTableActionMeta
} from '@actiontech/shared/lib/components/ActiontechTable/index.type';
import { ListRoleStatEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import { orderBy } from 'lodash';
import { t } from '../../../locale';
import UserDesc from './UserDesc';
import { IconMemberIsAdmin, IconMemberNotAdmin } from '../../../icon/member';
import { UserStatusStyledWrapper } from '../style';
import generateTag from '../Common/generateTag';
import { Space } from 'antd';

export const RoleListColumns: ActiontechTableColumn<IListRole> = [
  {
    dataIndex: 'name',
    title: () => t('dmsUserCenter.role.roleForm.name')
  },
  {
    dataIndex: 'desc',
    title: () => t('dmsUserCenter.role.roleForm.desc'),
    className: 'user-center-table-desc-column',
    render: (desc: string) => {
      return desc ? <UserDesc desc={desc} /> : '-';
    },
    width: 400
  },
  {
    dataIndex: 'stat',
    title: () => t('common.status'),
    render: (stat: ListRoleStatEnum) => {
      return (
        <UserStatusStyledWrapper>
          {stat === ListRoleStatEnum.被禁用 ? (
            <IconMemberNotAdmin />
          ) : (
            <IconMemberIsAdmin />
          )}
          {stat}
        </UserStatusStyledWrapper>
      );
    },
    width: 120
  },
  {
    dataIndex: 'op_permissions',
    title: () => t('dmsUserCenter.role.roleForm.opPermissions'),
    render: (list: IUidWithName[]) => {
      if (!Array.isArray(list)) {
        return '-';
      }
      orderBy(list, ['name'], ['asc']);
      return <Space wrap>{generateTag(list)}</Space>;
    },
    width: 400
  }
];

export const RoleListActions = (
  onEditRole: (record?: IListRole) => void,
  onDeleteRole: (record?: IListRole) => void
): ActiontechTableActionMeta<IListRole>[] => {
  return [
    {
      text: t('common.edit'),
      key: 'roleManage',
      buttonProps: (record) => {
        return {
          onClick: () => {
            onEditRole(record);
          }
        };
      }
    },
    {
      text: t('common.delete'),
      buttonProps: () => ({
        danger: true
      }),
      key: 'roleDelete',
      confirm: (record) => {
        return {
          title: t('dmsUserCenter.role.deleteRole.deleteTips', {
            name: record?.name ?? ''
          }),
          onConfirm: () => {
            onDeleteRole(record);
          }
        };
      }
    }
  ];
};
