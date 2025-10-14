import { ActiontechTableColumn } from '@actiontech/dms-kit/es/components/ActiontechTable/index.type';
import { IListOpPermission } from '@actiontech/shared/lib/api/base/service/common';
import { t } from '../../../../locale';
import { getOpRangeTypeName } from '../../../../hooks/useOpPermission/index.data';
import { ListMemberRoleWithOpRangeOpRangeTypeEnum } from '@actiontech/shared/lib/api/base/service/common.enum';

export const permissionListColumns: () => ActiontechTableColumn<IListOpPermission> =
  () => [
    {
      dataIndex: 'range_type',
      title: () => t('dmsUserCenter.role.opPermissionList.columns.range'),
      render: (rangeType) =>
        getOpRangeTypeName(
          rangeType as ListMemberRoleWithOpRangeOpRangeTypeEnum | undefined
        )
    },
    {
      dataIndex: 'module',
      title: () => t('dmsUserCenter.role.opPermissionList.columns.module'),
      render: (module) => {
        return module || '-';
      }
    },
    {
      dataIndex: 'op_permission',
      title: () => t('dmsUserCenter.role.opPermissionList.columns.name'),
      render: (opPermission) => {
        return opPermission?.name ?? '';
      }
    }
  ];
