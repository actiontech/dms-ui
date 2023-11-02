import { Button, Input, Tag, Typography } from 'antd';
import { TableColumn } from '~/components/ProvisionTable';
import i18n from 'i18next';
import {
  IGetDataPermissionsInDataPermissionTemplate,
  IListDBAccountByAuth,
  IGetAuthorizationReply
} from '@actiontech/shared/lib/api/provision/service/common';

export const authTableColumns: TableColumn<IGetDataPermissionsInDataPermissionTemplate> =
  [
    {
      title: i18n.t<string>('auth.addAuth.baseForm.baseFormTable.service'),
      dataIndex: 'service_name',
      fixed: true
    },
    {
      title: i18n.t<string>('auth.addAuth.baseForm.baseFormTable.objects'),
      dataIndex: 'data_objects',
      render: (
        objects: IGetDataPermissionsInDataPermissionTemplate['data_objects']
      ) =>
        objects?.map((object) => (
          <Tag
            style={{ margin: 5 }}
            key={`${object.database_uid}${object.table_uid}`}
          >
            {object.name}
          </Tag>
        ))
    },
    {
      title: i18n.t<string>('auth.addAuth.baseForm.baseFormTable.operation'),
      dataIndex: 'data_operation_sets',
      render: (
        operations: IGetDataPermissionsInDataPermissionTemplate['data_operation_sets']
      ) =>
        operations?.map((operation) => (
          <Tag style={{ margin: 5 }} key={operation.uid}>
            {operation.name}
          </Tag>
        ))
    }
  ];

export const connectionTableColumns: TableColumn<IListDBAccountByAuth> = [
  {
    title: i18n.t<string>('auth.connectionDetails.dns'),
    dataIndex: 'data_object_service_dns'
  },
  {
    title: i18n.t<string>('auth.addAuth.accountForm.username'),
    dataIndex: 'user',
    render: (user) => {
      return <Typography.Text copyable={true}>{user}</Typography.Text>;
    }
  },
  {
    title: i18n.t<string>('auth.addAuth.accountForm.hostname'),
    width: 100,
    dataIndex: 'hostname'
  },
  {
    title: i18n.t<string>('auth.addAuth.accountForm.password'),
    dataIndex: 'password',
    render: (password) => {
      return <Input.Password bordered={false} value={password} />;
    }
  },
  {
    title: i18n.t<string>('auth.connectionDetails.explanation'),
    width: 100,
    dataIndex: 'explanation',
    render: (val) => (val ? val : '--')
  },
  {
    title: i18n.t<string>('common.operate'),
    dataIndex: 'connection_cmd',
    width: 110,
    fixed: 'right',
    render: (cmd) => {
      return (
        <Typography.Link
          copyable={{
            text: cmd,
            icon: [
              <Button key="before" type="link">
                {i18n.t<string>('auth.connectionDetails.copyString')}
              </Button>,
              <Button key="after" type="link">
                {i18n.t<string>('auth.connectionDetails.copyString')}
              </Button>
            ]
          }}
        />
      );
    }
  }
];
interface ICustomConfig {
  key: keyof Required<IGetAuthorizationReply>['data'];
  type: 'p' | 'table';
  prefix: string;
  headers?: string[];
}

export const customConfig: ICustomConfig[] = [
  {
    key: 'purpose',
    type: 'p',
    prefix: i18n.t('auth.addAuth.steps.purpose')
  },
  {
    key: 'businesses',
    type: 'p',
    prefix: i18n.t('auth.connectionDetails.business')
  },
  {
    key: 'permission_user',
    type: 'p',
    prefix: i18n.t('auth.columns.permissionUser')
  },
  {
    key: 'data_permissions',
    type: 'table',
    prefix: i18n.t('auth.template.columns.template_details'),
    headers: authTableColumns.map((item) => String(item.title))
  },
  {
    key: 'db_accounts',
    type: 'table',
    prefix: i18n.t('auth.connectionDetails.accountInfo'),
    headers: connectionTableColumns
      .map((item) => String(item.title))
      .slice(0, connectionTableColumns.length - 1)
  }
];
