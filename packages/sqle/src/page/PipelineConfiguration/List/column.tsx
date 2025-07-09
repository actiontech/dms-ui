import {
  ActiontechTableColumn,
  PageInfoWithoutIndexAndSize
} from '@actiontech/shared/lib/components/ActiontechTable';
import { IGetPipelinesV1Params } from '@actiontech/shared/lib/api/sqle/service/pipeline/index.d';
import { t } from '../../../locale';
import { BasicTypographyEllipsis, BasicTag } from '@actiontech/shared';
import { IPipelineDetail } from '@actiontech/shared/lib/api/sqle/service/common';
import { Typography, Space, Popover } from 'antd';

export type PipelineConfigurationTableFilterParamType =
  PageInfoWithoutIndexAndSize<IGetPipelinesV1Params, 'project_name'>;

export const pipelineConfigurationListColumns: (
  onViewPipelineDetail: (id?: number) => void
) => ActiontechTableColumn<IPipelineDetail, IGetPipelinesV1Params> = (
  onViewPipelineDetail
) => {
  return [
    {
      dataIndex: 'name',
      className: 'ellipsis-column-width',
      width: '18%',
      title: () => t('pipelineConfiguration.table.name'),
      render: (name, record) => {
        return (
          <Typography.Link onClick={() => onViewPipelineDetail(record.id)}>
            {name}
          </Typography.Link>
        );
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
      className: 'ellipsis-column-width',
      title: () => t('pipelineConfiguration.table.address'),
      render: (address) => {
        if (!address) return '-';
        return <BasicTypographyEllipsis textCont={address} />;
      }
    },
    {
      dataIndex: 'node_count',
      title: () => t('pipelineConfiguration.table.nodeCount')
    },
    {
      dataIndex: 'data_sources',
      title: () => t('pipelineConfiguration.table.dataSources'),
      width: '25%',
      render: (dataSources) => {
        if (!dataSources || dataSources.length === 0) {
          return '-';
        }
        const displayList = dataSources?.slice(0, 3);
        return (
          <Space wrap size={4}>
            {displayList?.map((item) => (
              <BasicTag key={item}>{item}</BasicTag>
            ))}
            <Popover
              content={
                <Space direction="vertical">
                  {dataSources?.map((item) => (
                    <BasicTag key={item}>{item}</BasicTag>
                  ))}
                </Space>
              }
              placement="top"
              overlayStyle={{ maxWidth: 450 }}
              trigger="click"
            >
              <Typography.Link>
                {t('pipelineConfiguration.table.viewAll')}
              </Typography.Link>
            </Popover>
          </Space>
        );
      }
    }
  ];
};
