import { t } from '../../../../locale';
import { ActiontechTableToolbarActionMeta } from '@actiontech/shared/lib/components/ActiontechTable';
import { IResourceListData } from '@actiontech/shared/lib/api/base/service/common';
import { ActiontechTableActionMeta } from '@actiontech/shared/lib/components/ActiontechTable/index.type';
export const ResourceDetailToolbarActions = (
  onExport: () => void,
  exporting: boolean
): ActiontechTableToolbarActionMeta[] => {
  return [
    {
      key: 'export',
      text: t('dmsCloudBeaver.operationList.exportButton'),
      buttonProps: {
        onClick: onExport,
        loading: exporting
      }
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
