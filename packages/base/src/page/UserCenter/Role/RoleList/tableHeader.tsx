import { Space, Typography, Divider, Popconfirm } from 'antd';
import { TableColumn } from '@actiontech/shared/lib/types/common.type';
import { orderBy } from 'lodash';
import { t } from '../../../../locale';
import {
  IListRole,
  IUidWithName
} from '@actiontech/shared/lib/api/base/service/common';
import { ListRoleStatEnum } from '@actiontech/shared/lib/api/base/service/common.enum';

export const tableHeaderFactory = (
  updateRole: (role: IListRole) => void,
  deleteRole: (roleName: string, roleUid: string) => void
): TableColumn<IListRole, 'operator'> => {
  return [
    {
      dataIndex: 'name',
      title: () => t('dmsUserCenter.role.roleForm.name')
    },
    {
      dataIndex: 'desc',
      title: () => t('dmsUserCenter.role.roleForm.desc')
    },
    {
      dataIndex: 'stat',
      title: () => t('common.status'),
      render: (stat: ListRoleStatEnum) => {
        return (
          <Typography.Text
            type={stat === ListRoleStatEnum['被禁用'] ? 'danger' : undefined}
          >
            {stat}
          </Typography.Text>
        );
      }
    },
    {
      dataIndex: 'op_permissions',
      title: () => t('dmsUserCenter.role.roleForm.opPermissions'),
      render: (list: IUidWithName[]) => {
        if (!Array.isArray(list)) {
          return '';
        }
        orderBy(list, ['name'], ['asc']);
        return list.map((e) => e.name).join(',');
      }
    },
    {
      dataIndex: 'operator',
      title: () => t('common.operate'),
      render: (_, record) => {
        return (
          <Space className="user-cell flex-end-horizontal">
            <Typography.Link
              className="pointer"
              onClick={updateRole.bind(null, record)}
            >
              {t('common.edit')}
            </Typography.Link>
            <Divider type="vertical" />
            <Popconfirm
              title={t('dmsUserCenter.role.deleteRole.deleteTips', {
                name: record.name
              })}
              placement="topRight"
              okText={t('common.ok')}
              cancelText={t('common.cancel')}
              onConfirm={deleteRole.bind(
                null,
                record.name ?? '',
                record.uid ?? ''
              )}
            >
              <Typography.Text type="danger" className="pointer">
                {t('common.delete')}
              </Typography.Text>
            </Popconfirm>
          </Space>
        );
      }
    }
  ];
};
