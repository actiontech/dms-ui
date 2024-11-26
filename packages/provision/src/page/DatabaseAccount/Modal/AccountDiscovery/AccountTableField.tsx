import { useState } from 'react';
import { AccountTableFieldProps } from '../../index.type';
import { useTranslation } from 'react-i18next';
import { AccountTableFieldStyleWrapper } from '../../style';
import {
  IDBAccountBody,
  IUidWithName
} from '@actiontech/shared/lib/api/provision/service/common';
import { IBasicTable } from '@actiontech/shared/lib/components/BasicTable';
import RoleTableTagsCell from '../../../DatabaseRole/RoleTableTagsCell';
import { BasicInput } from '@actiontech/shared';
import RefreshButton from '@actiontech/shared/lib/components/ActiontechTable/components/RefreshButton';

const AccountTableField: React.FC<AccountTableFieldProps> = ({
  data,
  loading,
  onChange,
  refresh
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [fuzzySearchKeyword, setFuzzySearchKeyword] = useState<string>();

  const { t } = useTranslation();

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
    onChange?.(
      data?.filter((i) =>
        newSelectedRowKeys.includes(`${i?.hostname}${i?.user}` as React.Key)
      )
    );
  };

  const columns: IBasicTable<IDBAccountBody>['columns'] = [
    {
      dataIndex: 'user',
      title: t('databaseAccount.list.column.account')
    },
    {
      dataIndex: 'db_roles',
      title: t('databaseAccount.create.form.role'),
      render: (dbRoles: IUidWithName[]) => {
        return (
          <RoleTableTagsCell dataSource={dbRoles?.map((v) => v.name!) ?? []} />
        );
      }
    },
    {
      dataIndex: 'permission_info',
      title: t('databaseAccount.list.column.permission'),
      render: (permission: IDBAccountBody['permission_info']) => {
        return (
          <RoleTableTagsCell
            dataSource={permission?.grants?.map((v) => v!) ?? []}
          />
        );
      }
    }
  ];

  return (
    <>
      <div hidden={!data} className="flex-space-between">
        <BasicInput
          style={{ width: 300 }}
          placeholder={t('databaseAccount.discovery.userFilterPlaceholder')}
          size="small"
          value={fuzzySearchKeyword}
          onChange={(e) => {
            setFuzzySearchKeyword(e.target.value);
          }}
        />
        <RefreshButton refresh={refresh} />
      </div>
      <AccountTableFieldStyleWrapper
        dataSource={data?.filter((v) =>
          fuzzySearchKeyword
            ? v.user
                ?.toLocaleLowerCase()
                .includes(fuzzySearchKeyword?.toLocaleLowerCase())
            : true
        )}
        columns={columns}
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectChange,
          fixed: true
        }}
        loading={loading}
        scroll={{
          x: 'max-content',
          y: 540
        }}
        rowKey={(record: IDBAccountBody) => {
          return `${record?.hostname}${record?.user}`;
        }}
      />
    </>
  );
};

export default AccountTableField;
