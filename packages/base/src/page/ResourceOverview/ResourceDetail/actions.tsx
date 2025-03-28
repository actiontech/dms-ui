import { t } from '../../../locale';
import { ActiontechTableToolbarActionMeta } from '@actiontech/shared/lib/components/ActiontechTable';

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
