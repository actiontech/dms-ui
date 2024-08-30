import {
  ActiontechTableColumn,
  PageInfoWithoutIndexAndSize,
  ActiontechTableActionMeta
} from '@actiontech/shared/lib/components/ActiontechTable';
import { IGetPipelinesV1Params } from '@actiontech/shared/lib/api/sqle/service/pipeline/index.d';
import { t } from '../../../locale';
import { BasicTypographyEllipsis } from '@actiontech/shared';
import { IPipelineDetail } from '@actiontech/shared/lib/api/sqle/service/common';
import { Typography } from 'antd';

export type PipelineConfigurationTableFilterParamType =
  PageInfoWithoutIndexAndSize<IGetPipelinesV1Params, 'project_name'>;

export const PipelineConfigurationListColumns: () => ActiontechTableColumn<
  IPipelineDetail,
  IGetPipelinesV1Params
> = () => {
  return [
    {
      dataIndex: 'name',
      title: () => t('pipelineConfiguration.table.name'),
      render: (name) => {
        return <Typography.Link>{name}</Typography.Link>;
      }
    },
    {
      dataIndex: 'description',
      title: () => t('pipelineConfiguration.table.desc'),
      className: 'ellipsis-column-width',
      render: (desc) => {
        if (!desc) return '-';
        return <BasicTypographyEllipsis textCont={desc} />;
      }
    },
    {
      dataIndex: 'address',
      title: () => t('pipelineConfiguration.table.address'),
      render: (address) => {
        return address || '-';
      }
    },
    {
      dataIndex: 'node_count',
      title: () => t('pipelineConfiguration.table.nodeCount')
    }
  ];
};

export const PipelineConfigurationListActions: (
  onEdit: (id?: number) => void,
  onDelete: (id?: number) => void
) => {
  buttons: ActiontechTableActionMeta<IPipelineDetail>[];
} = (onEdit, onDelete) => {
  return {
    buttons: [
      {
        key: 'edit-button',
        text: t('common.edit'),
        buttonProps: (record) => ({
          onClick: () => onEdit(record?.id)
        })
      },
      {
        key: 'delete-button',
        text: t('common.delete'),
        buttonProps: () => ({ danger: true }),
        confirm: (record) => ({
          title: t('pipelineConfiguration.table.confirmDelete'),
          onConfirm: () => onDelete(record?.id)
        })
      }
    ]
  };
};
