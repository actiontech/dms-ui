import {
  ActiontechTableActionMeta,
  ActiontechTableColumn
} from '@actiontech/shared/lib/components/ActiontechTable';
import { IPipelineNodeDetail } from '@actiontech/shared/lib/api/sqle/service/common';
import { t } from '../../../../../locale/index';
import { PipelineNodeTypeDictionary } from '../index.data';
import { DragHandle } from './DragTableRow';

export const PipelineNodeTableColumn =
  (): ActiontechTableColumn<IPipelineNodeDetail> => {
    return [
      {
        key: 'sort',
        align: 'center',
        dataIndex: 'id',
        width: 80,
        render: () => <DragHandle />
      },
      {
        title: () => <>{t('pipelineConfiguration.form.node.name')}</>,
        dataIndex: 'name'
      },
      {
        title: () => <>{t('pipelineConfiguration.form.node.type')}</>,
        dataIndex: 'type',
        render: (value: IPipelineNodeDetail['type']) => {
          return value ? PipelineNodeTypeDictionary[value] : '-';
        }
      }
    ];
  };

export const PipelineNodeTableActions = (
  onEdit: (id?: number) => void,
  onRemove: (id?: number) => void
): ActiontechTableActionMeta<IPipelineNodeDetail>[] => {
  return [
    {
      key: 'edit',
      text: t('common.edit'),
      buttonProps: (record) => {
        return {
          onClick: onEdit.bind(null, record?.id)
        };
      }
    },
    {
      key: 'delete',
      text: t('common.delete'),
      buttonProps: () => {
        return {
          danger: true
        };
      },
      confirm: (record) => ({
        title: t('pipelineConfiguration.form.node.removeConfirmTips'),
        onConfirm: onRemove.bind(null, record?.id)
      })
    }
  ];
};
