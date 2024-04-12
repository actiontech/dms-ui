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
        if (
          !business ||
          !business.length ||
          (business.length === 1 && business[0] === '')
        ) {
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
