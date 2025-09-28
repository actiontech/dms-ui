import {
  ActiontechTableActionMeta,
  ActiontechTableColumn
} from '@actiontech/dms-kit/es/components/ActiontechTable';
import { t } from '../../../../../locale/index';
import { PipelineNodeTypeDictionary } from '../index.data';
import { DragHandle } from './DragTableRow';
import { PipelineNodeType } from '../index.type';

export const PipelineNodeTableColumn =
  (): ActiontechTableColumn<PipelineNodeType> => {
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
        render: (value: PipelineNodeType['type']) => {
          return value ? PipelineNodeTypeDictionary[value] : '-';
        }
      }
    ];
  };

export const PipelineNodeTableActions = (
  onEdit: (id?: string) => void,
  onRemove: (id?: string) => void
): ActiontechTableActionMeta<PipelineNodeType>[] => {
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
