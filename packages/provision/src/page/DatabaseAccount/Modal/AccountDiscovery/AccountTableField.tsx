import { useState } from 'react';
import { AccountTableFieldProps } from '../../index.type';
import { useTranslation } from 'react-i18next';
import { AccountTableFieldStyleWrapper } from '../../style';
import { IDBAccountBody } from '@actiontech/shared/lib/api/provision/service/common';
import { BasicTag } from '@actiontech/shared';
import { Space } from 'antd';

const AccountTableField: React.FC<AccountTableFieldProps> = ({
  data,
  loading,
  onChange
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const { t } = useTranslation();

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
    onChange?.(
      data?.filter((i) =>
        newSelectedRowKeys.includes(`${i?.hostname}${i?.user}` as React.Key)
      )
    );
  };

  const columns = [
    {
      dataIndex: 'user',
      title: t('databaseAccount.list.column.account')
    },
    {
      dataIndex: 'permission_info',
      title: t('databaseAccount.list.column.permission'),
      render: (permission: IDBAccountBody['permission_info']) => {
        return (
          <Space>
            {permission?.grants?.map((item) => {
              return <BasicTag key={item}>{item}</BasicTag>;
            })}
          </Space>
        );
      }
    }
  ];

  return (
    <AccountTableFieldStyleWrapper
      dataSource={data}
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
  );
};

export default AccountTableField;
