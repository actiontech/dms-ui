import {
  ActiontechTableColumn,
  ActiontechTableActionMeta
} from '@actiontech/shared/lib/components/ActiontechTable';
import { IOptimizationSQL } from '@actiontech/shared/lib/api/sqle/service/common';
import { t } from '../../../../locale';
import { floatToPercent } from '@actiontech/shared/lib/utils/Math';
import { SQLRenderer } from '@actiontech/shared';

export type IOptimizationSQLIncludeOrder = IOptimizationSQL & { order: number };

export const SqlOptimizationListColumns: () => ActiontechTableColumn<IOptimizationSQLIncludeOrder> =
  () => {
    return [
      {
        dataIndex: 'order',
        title: () => t('sqlOptimization.overview.sqlTable.order')
      },
      {
        dataIndex: 'original_sql',
        title: () => t('sqlOptimization.overview.sqlTable.sql'),
        className: 'ellipsis-column-width',
        render: (original_sql) => {
          if (!original_sql) return null;
          return (
            <SQLRenderer.Snippet
              showCopyIcon
              sql={original_sql}
              rows={1}
              cuttingLength={200}
            />
          );
        }
      },
      {
        dataIndex: 'number_of_syntax_error',
        title: () => t('sqlOptimization.overview.sqlTable.syntaxError'),
        render: (value) => {
          return value || '-';
        }
      },
      {
        dataIndex: 'number_of_index',
        title: () => t('sqlOptimization.overview.sqlTable.recommendedIndex'),
        render: (value) => {
          return value || '-';
        }
      },
      {
        dataIndex: 'number_of_hit_index',
        title: () => t('sqlOptimization.overview.sqlTable.hitIndex'),
        render: (value) => {
          return value || '-';
        }
      },
      {
        dataIndex: 'number_of_rewrite',
        title: () => t('sqlOptimization.overview.sqlTable.rewriteNumber'),
        render: (value) => {
          return value || '-';
        }
      },
      {
        dataIndex: 'performance',
        title: () =>
          t('sqlOptimization.overview.sqlTable.performanceImprovement'),
        render: (performance) => {
          if (!performance) {
            return '-';
          }
          return isNaN(performance) ? '-' : `${floatToPercent(performance)}%`;
        }
      },
      {
        dataIndex: 'contributing_indices',
        title: () => t('sqlOptimization.overview.sqlTable.indexUsed'),
        render: (value) => {
          return value || '-';
        }
      }
    ];
  };

export const SqlOptimizationListActions = (
  gotoDetailPage: (record?: IOptimizationSQLIncludeOrder) => void,
  disableDetailButton: boolean
): {
  buttons: ActiontechTableActionMeta<IOptimizationSQLIncludeOrder>[];
} => ({
  buttons: [
    {
      key: 'optimization_detail',
      text: t('sqlOptimization.overview.sqlTable.buttonText'),
      buttonProps: (record) => ({
        onClick: () => {
          gotoDetailPage(record);
        },
        disabled: !!record?.number_of_syntax_error || disableDetailButton
      })
    }
  ]
});
