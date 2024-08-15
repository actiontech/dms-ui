import { ActiontechTableColumn } from '@actiontech/shared/lib/components/ActiontechTable/index.type';
import { IListOpPermission } from '@actiontech/shared/lib/api/base/service/common';
import { t } from '../../../../locale';
import { getOpRangeTypeName } from '../../../../hooks/useOpPermission/index.data';
import { ListMemberRoleWithOpRangeOpRangeTypeEnum } from '@actiontech/shared/lib/api/base/service/common.enum';

export const PermissionListColumns: () => ActiontechTableColumn<IListOpPermission> =
  () => [
    {
      dataIndex: 'op_permission',
      title: () => t('dmsUserCenter.role.opPermissionList.columns.name'),
      render: (opPermission) => {
        return opPermission?.name ?? '';
      }
    },
    {
      dataIndex: 'range_type',
      title: () => t('dmsUserCenter.role.opPermissionList.columns.range'),
      render: (rangeType) => {
        if (!rangeType) {
          return '-';
        }
        return getOpRangeTypeName(
          rangeType as unknown as ListMemberRoleWithOpRangeOpRangeTypeEnum
        );
      }
    },
    {
      dataIndex: 'description',
      title: () => t('dmsUserCenter.role.opPermissionList.columns.desc')
    }
  ];
