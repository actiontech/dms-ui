import {
  ActiontechTableActionMeta,
  ActiontechTableColumn
} from '@actiontech/shared/lib/components/ActiontechTable';
import { t } from '../../../../locale';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { EditText } from '@actiontech/shared';
import { tooltipsCommonProps } from '@actiontech/shared/lib/components/BasicToolTips';

export const ScanTypeSqlCollectionColumns: () => ActiontechTableColumn<any> =
  () => {
    return [
      {
        dataIndex: 'index',
        title: () =>
          t('managementConf.detail.scanTypeSqlCollection.column.index')
      },
      {
        dataIndex: 'sqlFingerprint',
        title: () =>
          t('managementConf.detail.scanTypeSqlCollection.column.sqlFingerprint')
      },
      {
        dataIndex: 'source',
        title: () =>
          t('managementConf.detail.scanTypeSqlCollection.column.source')
      },
      {
        dataIndex: 'belongingDataSource',
        title: () =>
          t(
            'managementConf.detail.scanTypeSqlCollection.column.belongingDataSource'
          ),
        filterCustomType: 'select',
        filterKey: 'filter_data_source'
      },
      {
        dataIndex: 'execTime',
        title: () =>
          t('managementConf.detail.scanTypeSqlCollection.column.execTime'),
        render: (time) => {
          return formatTime(time, '-');
        }
      },
      {
        dataIndex: 'lastAppearanceTime',
        title: () =>
          t(
            'managementConf.detail.scanTypeSqlCollection.column.lastAppearanceTime'
          ),
        render: (time) => {
          return formatTime(time, '-');
        },
        filterCustomType: 'date-range',
        filterKey: ['filter_form', 'filter_to']
      },
      {
        dataIndex: 'firstAppearanceTime',
        title: () =>
          t(
            'managementConf.detail.scanTypeSqlCollection.column.firstAppearanceTime'
          ),
        render: (time) => {
          return formatTime(time, '-');
        }
      },
      {
        dataIndex: 'occurrenceCount',
        title: () =>
          t(
            'managementConf.detail.scanTypeSqlCollection.column.occurrenceCount'
          )
      },
      {
        dataIndex: 'status',
        title: () =>
          t('managementConf.detail.scanTypeSqlCollection.column.status')
      },
      {
        dataIndex: 'explanation',
        title: () =>
          t(
            'managementConf.detail.scanTypeSqlCollection.column.explanation.text'
          ),
        className: 'table-describe-column',
        render: (description: string, record) => {
          return (
            <EditText
              editButtonProps={{
                children: t(
                  'managementConf.detail.scanTypeSqlCollection.column.explanation.operator'
                ),
                size: 'small'
              }}
              editable={{
                autoSize: true,
                onEnd: (val) => {
                  // updateSqlDescribe(record.number ?? 0, val);
                }
              }}
              ellipsis={{
                expandable: false,
                tooltip: {
                  arrow: false,
                  ...tooltipsCommonProps(description, 500)
                },
                rows: 1
              }}
              value={description}
            />
          );
        }
      }
    ];
  };

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
