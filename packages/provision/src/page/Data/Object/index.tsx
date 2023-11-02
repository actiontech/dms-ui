import { SyncOutlined } from '@ant-design/icons';
import { Box } from '@mui/system';
import { useRequest } from 'ahooks';
import { Button, Card, Space } from 'antd';
import { Key } from 'antd/es/table/interface';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSetRecoilState } from 'recoil';
import ProvisionTable from '~/components/ProvisionTable';
import useTablePagination from '~/components/ProvisionTable/hooks/useTablePagination';
import { EventEmitterKey, ModalName } from '~/data/enum';
import useModalStatus from '~/hooks/useModalStatus';
import ObjectListFilterForm, {
  IFilteredInfo
} from '~/page/Data/Object/ObjectListFilterForm';
import {
  DataObjectModalStatus,
  DataObjectSelectedData
} from '~/store/data/object';
import EventEmitter from '~/utils/EventEmitter';
import DataObjectModal from './Modal';
import { dataObjectListTableColumns } from './TableColumns';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import auth from '@actiontech/shared/lib/api/provision/service/auth';
import { IListService } from '@actiontech/shared/lib/api/provision/service/common';

const DataObject = () => {
  const { t } = useTranslation();
  const { pageIndex, pageSize, total, setTotal, handleTablePaginationChange } =
    useTablePagination();
  const [filteredInfo, setFilteredInfo] = useState<IFilteredInfo | null>(null);
  const { projectID } = useCurrentProject();
  const {
    data: dataObject,
    loading,
    refresh
  } = useRequest(
    () =>
      auth
        .AuthListService({
          page_index: pageIndex,
          page_size: pageSize,
          filter_by_namespace: projectID,
          ...filteredInfo
        })
        .then((res) => {
          setTotal(res.data.total_nums ?? 0);
          return res.data.data;
        }),
    {
      refreshDeps: [pageIndex, pageSize, filteredInfo, projectID]
    }
  );

  const { toggleModal, initModalStatus } = useModalStatus(
    DataObjectModalStatus
  );
  const updateSelectData = useSetRecoilState(DataObjectSelectedData);

  const openModal = (name: ModalName, record?: IListService) => {
    toggleModal(name, true);
    if (record) {
      updateSelectData(record);
    }
  };

  useEffect(() => {
    initModalStatus({
      [ModalName.ViewAccount]: false
    });
  }, [initModalStatus]);

  useEffect(() => {
    const { unsubscribe } = EventEmitter.subscribe(
      EventEmitterKey.Refresh_Data_Object_List_Table,
      () => {
        refresh();
      }
    );
    return unsubscribe;
  }, [refresh]);

  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<string>>([]);
  const onChange = (selectedRowKeys: Key[]) => {
    setSelectedRowKeys(selectedRowKeys as string[]);
  };
  return (
    <Box
      sx={{
        padding: (theme) => theme.layout.padding
      }}
    >
      <Card
        title={
          <Space>
            {t('dataObject.list.title')}
            <Button onClick={refresh} data-testid="refresh">
              <SyncOutlined spin={loading} />
            </Button>
          </Space>
        }
      >
        <ObjectListFilterForm setFilteredInfo={setFilteredInfo} />
        <ProvisionTable
          rowKey="uid"
          loading={loading}
          columns={dataObjectListTableColumns(openModal)}
          dataSource={dataObject ?? []}
          pagination={{ total }}
          onChange={handleTablePaginationChange}
          scroll={{ x: 'max-content' }}
          rowSelection={{
            selectedRowKeys: selectedRowKeys,
            onChange
          }}
        />
      </Card>
      <DataObjectModal />
    </Box>
  );
};

export default DataObject;
