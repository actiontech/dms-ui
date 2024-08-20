import { IListRole } from '@actiontech/shared/lib/api/base/service/common';
import {
  ActiontechTableColumn,
  ActiontechTableActionMeta
} from '@actiontech/shared/lib/components/ActiontechTable/index.type';
import { ListRoleStatEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import { orderBy } from 'lodash';
import { t } from '../../../../locale';
import generateTag from '../../utils/generateTag';
import { Space } from 'antd';
import { BasicTypographyEllipsis } from '@actiontech/shared';
import { TableColumnWithIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { CheckHexagonOutlined, CloseHexagonOutlined } from '@actiontech/icons';

export const RoleListColumns: () => ActiontechTableColumn<IListRole> = () => [
  {
    dataIndex: 'name',
    title: () => t('dmsUserCenter.role.roleForm.name')
  },
  {
    dataIndex: 'desc',
    title: () => t('dmsUserCenter.role.roleForm.desc'),
    className: 'ellipsis-column-width',
    render: (desc) => {
      return desc ? <BasicTypographyEllipsis textCont={desc} /> : '-';
    }
  },
  {
    dataIndex: 'stat',
    title: () => t('common.status'),
    render: (stat) => {
      return (
        <TableColumnWithIconStyleWrapper>
          {stat === ListRoleStatEnum.被禁用 ? (
            <CloseHexagonOutlined />
          ) : (
            <CheckHexagonOutlined />
          )}
          <span>{stat}</span>
        </TableColumnWithIconStyleWrapper>
      );
    }
  },
  {
    dataIndex: 'op_permissions',
    title: () => t('dmsUserCenter.role.roleForm.opPermissions'),
    render: (list) => {
      if (!Array.isArray(list)) {
        return '-';
      }
      orderBy(list, ['name'], ['asc']);
      return <Space wrap>{generateTag(list)}</Space>;
    },
    width: 500
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
