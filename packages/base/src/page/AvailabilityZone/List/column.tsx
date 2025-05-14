import { t } from '../../../locale';
import { IGateway } from '@actiontech/shared/lib/api/base/service/common';
import { ActiontechTableColumn } from '@actiontech/shared/lib/components/ActiontechTable';
import { IListGatewaysParams } from '@actiontech/shared/lib/api/base/service/Gateway/index.d';

export const AvailabilityZoneListColumns = (): ActiontechTableColumn<
  IGateway,
  IListGatewaysParams
> => {
  return [
    {
      dataIndex: 'gateway_name',
      title: t('availabilityZone.list.name')
    },
    {
      dataIndex: 'gateway_address',
      title: t('availabilityZone.list.address')
    }
  ];
};
