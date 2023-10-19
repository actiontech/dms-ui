import { Divider, Popconfirm, Space, Typography } from 'antd';
import { TableColumn } from '@actiontech/shared/lib/types/common.type';
import { t } from '../../../../locale';
import generateTag from '../../Common/generateTag';
import {
  IListUserGroup,
  IUidWithName
} from '@actiontech/shared/lib/api/base/service/common';
import { ListUserGroupStatEnum } from '@actiontech/shared/lib/api/base/service/common.enum';

export const userGroupTableHeaderFactory = (
  updateUserGroup: (data: IListUserGroup) => void,
  deleteUserGroup: (userGroupName: string, userGroupIod: string) => void
): TableColumn<IListUserGroup, 'operation'> => {
  return [
    {
      dataIndex: 'name',
      title: () => t('dmsUserCenter.user.userGroupForm.name')
    },
    {
      dataIndex: 'desc',
      title: () => t('dmsUserCenter.user.userGroupForm.desc')
    },
    {
      dataIndex: 'stat',
      title: () => t('common.status'),
      render: (status: ListUserGroupStatEnum) => {
        return (
          <Typography.Text
            type={
              status === ListUserGroupStatEnum.被禁用 ? 'danger' : undefined
            }
          >
            {status}
          </Typography.Text>
        );
      }
    },
    {
      dataIndex: 'users',
      title: () => t('dmsUserCenter.user.userGroupForm.bindUsers'),
      render: (users: IUidWithName) => {
        if (!Array.isArray(users)) {
          return '';
        }
        return generateTag(users);
      }
    },
    {
      dataIndex: 'operation',
      title: () => t('common.operate'),
      width: 180,
      render: (_, record) => {
        return (
          <Space>
            <Typography.Link
              className="pointer"
              onClick={updateUserGroup.bind(null, record)}
            >
              {t('common.manage')}
            </Typography.Link>
            <Divider type="vertical" />
            <Popconfirm
              title={t('dmsUserCenter.user.deleteUserGroup.confirm', {
                name: record.name
              })}
              placement="topRight"
              okText={t('common.ok')}
              cancelText={t('common.cancel')}
              onConfirm={deleteUserGroup.bind(
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
