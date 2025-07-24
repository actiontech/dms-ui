import { PageHeader } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import {
  AvailabilityZonePageHeaderActions,
  AvailabilityZoneTableActions
} from './action';
import AvailabilityZoneDrawer from '../Drawer';
import { useDispatch } from 'react-redux';
import { useEffect, useMemo } from 'react';
import {
  updateAvailabilityZoneModalStatus,
  updateSelectAvailabilityZone
} from '../../../store/availabilityZone';
import { ModalName } from '../../../data/ModalName';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import {
  ActiontechTable,
  useTableRequestError,
  useTableRequestParams,
  TableRefreshButton
} from '@actiontech/shared/lib/components/ActiontechTable';
import { useRequest } from 'ahooks';
import { DmsApi } from '@actiontech/shared/lib/api';
import { IGateway } from '@actiontech/shared/lib/api/base/service/common';
import { IListGatewaysParams } from '@actiontech/shared/lib/api/base/service/Gateway/index.d';
import { AvailabilityZoneListColumns } from './column';
import { usePermission } from '@actiontech/shared/lib/features';
import { message, Space } from 'antd';
import { ResponseCode } from '@actiontech/shared/lib/enum';

const AvailabilityZoneList: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [messageApi, contextHolder] = message.useMessage();

  const { parse2TableActionPermissions } = usePermission();

  const { tableChange, pagination } = useTableRequestParams<
    IGateway,
    IListGatewaysParams
  >();

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const {
    data: gateways,
    loading: getGatewaysLoading,
    refresh
  } = useRequest(
    () => {
      return handleTableRequestError(
        DmsApi.GatewayService.ListGateways({
          page_index: pagination.page_index,
          page_size: pagination.page_size
        })
      );
    },
    {
      refreshDeps: [pagination]
    }
  );

  const onCreate = () => {
    dispatch(
      updateAvailabilityZoneModalStatus({
        modalName: ModalName.DMS_Create_Availability_zone,
        status: true
      })
    );
  };

  const tableActions = useMemo(() => {
    const onEdit = (record?: IGateway) => {
      dispatch(
        updateAvailabilityZoneModalStatus({
          modalName: ModalName.DMS_Update_Availability_zone,
          status: true
        })
      );
      dispatch(updateSelectAvailabilityZone({ availabilityZone: record }));
    };

    const onDelete = (record?: IGateway) => {
      DmsApi.GatewayService.DeleteGateway({
        gateway_id: record?.gateway_id ?? ''
      }).then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(t('availabilityZone.list.deleteSuccessTips'));
          refresh();
          EventEmitter.emit(EmitterKey.Refresh_Availability_Zone_Selector);
        }
      });
    };
    return parse2TableActionPermissions(
      AvailabilityZoneTableActions(onEdit, onDelete)
    );
  }, [dispatch, parse2TableActionPermissions, refresh, messageApi, t]);

  useEffect(() => {
    const { unsubscribe } = EventEmitter.subscribe(
      EmitterKey.Refresh_Availability_Zone_Page,
      refresh
    );
    return unsubscribe;
  }, [refresh]);

  const pageHeaderActions = AvailabilityZonePageHeaderActions(onCreate);

  return (
    <>
      <PageHeader
        title={
          <Space>
            {t('availabilityZone.list.title')}
            <TableRefreshButton refresh={refresh} />
          </Space>
        }
        extra={pageHeaderActions['create_availability_zone']}
      />
      {contextHolder}
      <ActiontechTable
        rowKey="gateway_id"
        dataSource={gateways?.list}
        pagination={{
          total: gateways?.total ?? 0
        }}
        loading={getGatewaysLoading}
        columns={AvailabilityZoneListColumns()}
        errorMessage={requestErrorMessage}
        onChange={tableChange}
        actions={tableActions}
      />
      <AvailabilityZoneDrawer />
    </>
  );
};

export default AvailabilityZoneList;
