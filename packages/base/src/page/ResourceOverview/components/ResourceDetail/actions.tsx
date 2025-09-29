import { t } from '../../../../locale';
import { IResourceListData } from '@actiontech/shared/lib/api/base/service/common';
import { ActiontechTableActionMeta } from '@actiontech/dms-kit/es/components/ActiontechTable/index.type';
import {
  ActiontechTableToolbarActionWithPermissions,
  PERMISSIONS
} from '@actiontech/shared/lib/features';

export const ResourceDetailToolbarActions = (
  onExport: () => void,
  exporting: boolean
): ActiontechTableToolbarActionWithPermissions => {
  return [
    {
      key: 'export',
      text: t('resourceOverview.export'),
      buttonProps: {
        onClick: onExport,
        loading: exporting
      },
      permissions: PERMISSIONS.ACTIONS.BASE.RESOURCE_OVERVIEW.EXPORT
    }
  ];
};

export const ResourceDetailTableActions = (
  gotoDataSourceDetail: (record?: IResourceListData) => void
): ActiontechTableActionMeta<IResourceListData>[] => {
  return [
    {
      key: 'view-detail',
      text: t('resourceOverview.resourceList.viewDetail'),
      buttonProps: (record) => ({
        onClick: () => {
          gotoDataSourceDetail(record);
        }
      })
    }
  ];
};
