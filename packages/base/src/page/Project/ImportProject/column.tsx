import { ActiontechTableColumn } from '@actiontech/shared/lib/components/ActiontechTable';
import { IPreviewImportProjects } from '@actiontech/shared/lib/api/base/service/common';
import { BasicTag } from '@actiontech/shared';
import { Space } from 'antd';
import { t } from '../../../locale';
import BasicTypographyEllipsis from '@actiontech/shared/lib/components/BasicTypographyEllipsis';

export const importProjectListColumn: ActiontechTableColumn<IPreviewImportProjects> =
  [
    {
      dataIndex: 'name',
      className: 'ellipsis-column-small-width',
      title: () => t('dmsProject.importProject.table.project'),
      render: (value: string) => value || '-'
    },
    {
      dataIndex: 'desc',
      className: 'ellipsis-column-small-width',
      title: () => t('dmsProject.importProject.table.desc'),
      render: (desc: string) => {
        return desc ? <BasicTypographyEllipsis textCont={desc} /> : '-';
      }
    },
    {
      dataIndex: 'business',
      className: 'ellipsis-column-width',
      title: () => t('dmsProject.importProject.table.business'),
      render: (business: IPreviewImportProjects['business']) => {
        // 判断是否全为'' 因为后端会把文件中的空列解析为[''] 所以加此判断
        if (!business || !business.length || business.every((i) => i === '')) {
          return '-';
        }

        return (
          <Space wrap>
            {business.map((item, index) => (
              <BasicTag key={index}>{item}</BasicTag>
            ))}
          </Space>
        );
      }
    }
  ];
