import { useState } from 'react';
import {
  AccountTableFieldProps,
  ExpendedDBAccountBody
} from '../../index.type';
import { useTranslation } from 'react-i18next';
import { AccountTableFieldStyleWrapper } from '../../style';
import TableTagsCell from '../../../../components/TableTagsCell';
import { BasicInput, BasicTableProps } from '@actiontech/shared';
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
      data?.filter((i) => newSelectedRowKeys.includes(i.id as React.Key))
    );
  };
  const columns: BasicTableProps<ExpendedDBAccountBody>['columns'] = [
    {
      dataIndex: 'user',
      title: t('databaseAccount.list.column.account'),
      render: (username: string, record) => {
        if (!username) {
          return '-';
        }

        const hostname = record.additional_param?.find(
          (v) => v.key === 'hostname'
        )?.value;

        if (!hostname) {
          return username;
        }

        return `${username}@${hostname}`;
      }
    },
    {
      dataIndex: 'db_roles',
      title: t('databaseAccount.create.form.role'),
      render: (dbRoles: ExpendedDBAccountBody['db_roles']) => {
        return (
          <TableTagsCell dataSource={dbRoles?.map((v) => v.name!) ?? []} />
        );
      },
      width: 100
    },
    {
      dataIndex: 'permission_info',
      title: t('databaseAccount.list.column.privilege'),
      render: (permission: ExpendedDBAccountBody['permission_info']) => {
        return (
          <TableTagsCell
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
        rowKey="id"
      />
    </>
  );
};

export default AccountTableField;
