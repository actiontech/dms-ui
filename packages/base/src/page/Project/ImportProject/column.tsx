import { ActiontechTableColumn } from '@actiontech/shared/lib/components/ActiontechTable';
import { IPreviewImportProjects } from '@actiontech/shared/lib/api/base/service/common';
import { BasicTag } from '@actiontech/shared';
import { Space } from 'antd';

export const importProjectListColumn: ActiontechTableColumn<IPreviewImportProjects> =
  [
    {
      dataIndex: 'name',
      title: '项目',
      render: (value: string) => value || '-'
    },
    {
      dataIndex: 'business',
      title: '业务',
      render: (business: IPreviewImportProjects['business']) => {
        // 判断是否全为'' 因为后端会把文件中的空列解析为[''] 所以加此判断
        if (!business || !business.length || business.every((i) => i === '')) {
          return '-';
        }

        return (
          <Space>
            {business.map((item, index) => (
              <BasicTag key={index}>{item}</BasicTag>
            ))}
          </Space>
        );
      }
    }
  ];
