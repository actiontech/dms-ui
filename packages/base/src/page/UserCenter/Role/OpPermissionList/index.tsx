import { useAntdTable, useToggle } from 'ahooks';
import { SyncOutlined } from '@ant-design/icons';
import { Button, Card, Space, Table } from 'antd';
import { useTranslation } from 'react-i18next';
import tableHeaderFactory from './tableHeader';

import { TablePaginationProps } from '@actiontech/shared/lib/types/common.type';
import { IListOpPermissionsParams } from '@actiontech/shared/lib/api/base/service/dms/index.d';
import { ListOpPermissionsFilterByTargetEnum } from '@actiontech/shared/lib/api/base/service/dms/index.enum';
import dms from '@actiontech/shared/lib/api/base/service/dms';

const OpPermissionList: React.FC = () => {
  const { t } = useTranslation();
  const [refreshFlag, { toggle: toggleRefreshFlag }] = useToggle(false);

  const getOpPermissionList = ({ current, pageSize }: TablePaginationProps) => {
    const params: IListOpPermissionsParams = {
      page_index: current,
      page_size: pageSize,
      filter_by_target: ListOpPermissionsFilterByTargetEnum.all
    };

    return dms.ListOpPermissions(params).then((res) => {
      return {
        list: res.data?.data ?? [],
        total: res.data?.total_nums ?? 0
      };
    });
  };

  const { tableProps } = useAntdTable(getOpPermissionList, {
    refreshDeps: [refreshFlag]
  });

  return (
    <Card
      title={
        <Space>
          {t('dmsUserCenter.role.opPermissionList.title')}
          <Button onClick={toggleRefreshFlag}>
            <SyncOutlined spin={tableProps.loading} />
          </Button>
        </Space>
      }
    >
      <Table
        rowKey={(record) => record.op_permission?.uid ?? ''}
        columns={tableHeaderFactory()}
        {...tableProps}
      />
    </Card>
  );
};

export default OpPermissionList;
