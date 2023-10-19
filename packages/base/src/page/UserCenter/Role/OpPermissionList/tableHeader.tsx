import { TableColumn } from '@actiontech/shared/lib/types/common.type';
import { t } from '../../../../locale';
import { getOpRangeTypeName } from '../../../../hooks/useOpPermission/index.data';
import {
  IListOpPermission,
  IUidWithName
} from '@actiontech/shared/lib/api/base/service/common';
import { ListMemberRoleWithOpRangeOpRangeTypeEnum } from '@actiontech/shared/lib/api/base/service/common.enum';

const tableHeaderFactory = (): TableColumn<IListOpPermission> => {
  return [
    {
      dataIndex: 'op_permission',
      title: () => t('dmsUserCenter.role.opPermissionList.columns.name'),
      render: (opPermission: IUidWithName) => {
        return opPermission?.name ?? '';
      }
    },
    {
      dataIndex: 'range_type',
      title: () => t('dmsUserCenter.role.opPermissionList.columns.range'),
      render: (rangeType: ListMemberRoleWithOpRangeOpRangeTypeEnum) =>
        getOpRangeTypeName(rangeType)
    },
    {
      dataIndex: 'description',
      title: () => t('dmsUserCenter.role.opPermissionList.columns.desc')
    }
  ];
};

export default tableHeaderFactory;
