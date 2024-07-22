import { ActiontechTableActionMeta } from '@actiontech/shared/lib/components/ActiontechTable';
import { t } from '../../../../locale';

export const ScanTypeSqlCollectionColumnAction: (
  analysisAction: () => void
) => ActiontechTableActionMeta<any>[] = (analysisAction) => {
  return [
    {
      key: 'analysis',
      text: t(
        'managementConf.detail.scanTypeSqlCollection.column.action.analysis'
      ),
      buttonProps: () => {
        return {
          onClick: analysisAction
        };
      }
    }
  ];
};
