import { Divider, Popconfirm, Space, Typography } from 'antd';
import { orderBy } from 'lodash';
import { t } from '../../../../locale';
import { TableColumn } from '@actiontech/shared/lib/types/common.type';
import { EmptyBox } from '@actiontech/shared';
import generateTag from '../../Common/generateTag';
import {
  IListUser,
  IUidWithName
} from '@actiontech/shared/lib/api/base/service/common';
import { ListUserStatEnum } from '@actiontech/shared/lib/api/base/service/common.enum';

const tableHeaderFactory = (
  updateUser: (user: IListUser) => void,
  removeUser: (username: string, userUid: string) => void
): TableColumn<IListUser, 'operation'> => {
  return [
    {
      dataIndex: 'name',
      title: () => t('common.username')
    },
    {
      dataIndex: 'email',
      title: () => t('dmsUserCenter.user.userForm.email')
    },
    {
      dataIndex: 'phone',
      title: () => t('dmsUserCenter.user.userForm.phone')
    },
    {
      dataIndex: 'stat',
      title: () => t('dmsUserCenter.user.userList.columns.status'),
      render: (stat: ListUserStatEnum) => {
        return (
          <Typography.Text
            type={stat === ListUserStatEnum['被禁用'] ? 'danger' : undefined}
          >
            {stat}
          </Typography.Text>
        );
      }
    },
    {
      dataIndex: 'authentication_type',
      title: () => t('dmsUserCenter.user.userList.columns.authenticationType')
    },
    {
      dataIndex: 'user_groups',
      title: () => t('dmsUserCenter.user.userForm.userGroups'),
      render: (userGroupList?: IUidWithName[]) => {
        if (!Array.isArray(userGroupList)) {
          return '';
        }
        return generateTag(userGroupList);
      }
    },
    {
      dataIndex: 'op_permissions',
      title: () => t('dmsUserCenter.user.userForm.opPermissions'),
      render: (list: IUidWithName[]) => {
        if (!Array.isArray(list)) {
          return '';
        }
        return orderBy(list, ['uid'], ['asc'])
          .map((e) => e.name)
          .join(',');
      }
    },
    {
      dataIndex: 'operation',
      title: () => t('common.operate'),
      width: 180,
      render: (_, record) => {
        return (
          <Space className="user-cell flex-end-horizontal">
            <Typography.Link
              className="pointer"
              onClick={updateUser.bind(null, record)}
            >
              {t('common.manage')}
            </Typography.Link>
            <EmptyBox if={record.name !== 'admin'}>
              <Divider type="vertical" />
              <Popconfirm
                title={t('dmsUserCenter.user.deleteUser.confirmTitle', {
                  username: record.name
                })}
                placement="topRight"
                okText={t('common.ok')}
                cancelText={t('common.cancel')}
                onConfirm={removeUser.bind(
                  null,
                  record.name ?? '',
                  record.uid ?? ''
                )}
              >
                <Typography.Text type="danger" className="pointer">
                  {t('common.delete')}
                </Typography.Text>
              </Popconfirm>
              <Divider type="vertical" />
              <Typography.Link className="pointer">
                {t('common.more')}
              </Typography.Link>
            </EmptyBox>
          </Space>
        );
      }
    }
  ];
};

export default tableHeaderFactory;
