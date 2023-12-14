import React from 'react';
import { BasicToolTips, BasicTag } from '@actiontech/shared';
import { Space } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { IViewScope } from '../../../../../../api/common';
import { EllipsisModalStyleWrapper } from './style';

interface IEllipsisModalProps {
  data: IViewScope[];
}

const originData = [
  {
    scope_name: 'auth.AddRoleScopeMapping',
    group: '权限',
    scope_desc: '给角色绑定权限'
  },
  {
    scope_name: 'auth.CreateRole',
    group: '角色',
    scope_desc: '创建一个新角色'
  },
  {
    scope_name: 'auth.CreateUser',
    group: '用户',
    scope_desc: '创建用户'
  },
  {
    scope_name: 'auth.DeleteRole',
    group: '角色',
    scope_desc: '删除已经存在的角色'
  },
  {
    scope_name: 'auth.DeleteRoleScopeMapping',
    group: '权限',
    scope_desc: '删除角色已绑定权限'
  },
  {
    scope_name: 'auth.DeleteUser',
    group: '用户',
    scope_desc: '删除已经存在的用户'
  },
  {
    scope_name: 'auth.GetRoleByName',
    group: '角色',
    scope_desc: '查询单个角色'
  },
  {
    scope_name: 'auth.GetUserByName',
    group: '用户',
    scope_desc: '查询单个用户'
  },
  {
    scope_name: 'auth.ListRoleScopes',
    group: '权限',
    scope_desc: '访问角色操作权限列表'
  },
  {
    scope_name: 'auth.ListRoles',
    group: '角色',
    scope_desc: '访问角色列表'
  },
  {
    scope_name: 'auth.ListScopes',
    group: '权限',
    scope_desc: '访问操作权限列表'
  },
  {
    scope_name: 'auth.ListUsers',
    group: '用户',
    scope_desc: '访问用户列表'
  },
  {
    scope_name: 'auth.UpdatePassword',
    group: '用户',
    scope_desc: '更新任何用户的密码'
  },
  {
    scope_name: 'auth.UpdateRole',
    group: '角色',
    scope_desc: '更新已有角色'
  },
  {
    scope_name: 'auth.UpdateUser',
    group: '用户',
    scope_desc: '更新用户'
  },
  {
    scope_name: 'db.AddDB',
    group: '数据库',
    scope_desc: '添加数据库实例'
  },
  {
    scope_name: 'db.DeleteDB',
    group: '数据库',
    scope_desc: '删除数据库实例'
  },
  {
    scope_name: 'db.ListDBs',
    group: '数据库',
    scope_desc: '访问数据库实例列表'
  },
  {
    scope_name: 'monitor.ListConfigs',
    group: '监控',
    scope_desc: '访问监控源监控项配置列表'
  },
  {
    scope_name: 'monitor.ListMetrics',
    group: '监控',
    scope_desc: '访问监控指标列表'
  },
  {
    scope_name: 'server.AddServer',
    group: '服务器',
    scope_desc: '添加服务器'
  },
  {
    scope_name: 'server.DeleteServer',
    group: '服务器',
    scope_desc: '删除服务器'
  },
  {
    scope_name: 'server.ListServers',
    group: '服务器',
    scope_desc: '访问服务器列表'
  },
  {
    scope_name: 'server.UpdateServer',
    group: '服务器',
    scope_desc: '更新服务器'
  }
];

const EllipsisModal: React.FC<IEllipsisModalProps> = ({ data }) => {
  const groupData: { [key: string]: IViewScope[] } = {};
  originData.forEach((item) => {
    if (Object.keys(groupData).includes(item?.group ?? '')) {
      groupData[item?.group ?? ''].push({ ...item });
    } else {
      groupData[item?.group ?? ''] = [];
    }
  });
  console.log(groupData);
  return (
    <BasicToolTips
      title={Object.keys(groupData).map((item: string) => {
        return (
          <EllipsisModalStyleWrapper>
            {item}:{' '}
            <Space wrap>
              {groupData[item].map((groupItem) => (
                <BasicTag key={groupItem.scope_name}>
                  {groupItem.scope_desc}
                </BasicTag>
              ))}
            </Space>
            <br />
          </EllipsisModalStyleWrapper>
        );
      })}
    >
      <span>
        <EllipsisOutlined />
      </span>
    </BasicToolTips>
  );
};

export default EllipsisModal;
