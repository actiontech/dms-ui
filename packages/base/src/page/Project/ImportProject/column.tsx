import { ActiontechTableColumn } from '@actiontech/shared/lib/components/ActiontechTable';
import { IPreviewImportProjectsV2 } from '@actiontech/shared/lib/api/base/service/common';
import { BasicTag, BasicTypographyEllipsis } from '@actiontech/shared';
import { t } from '../../../locale';

export const importProjectListColumn: ActiontechTableColumn<IPreviewImportProjectsV2> =
  [
    {
      dataIndex: 'name',
      className: 'ellipsis-column-small-width',
      title: () => t('dmsProject.importProject.table.project'),
      render: (value) => value || '-'
    },
    {
      dataIndex: 'desc',
      className: 'ellipsis-column-small-width',
      title: () => t('dmsProject.importProject.table.desc'),
      render: (desc) => {
        return desc ? <BasicTypographyEllipsis textCont={desc} /> : '-';
      }
    },
    {
      dataIndex: 'business_tag',
      className: 'ellipsis-column-width',
      title: () => t('dmsProject.importProject.table.business'),
      render: (business) => {
        if (!business) {
          return '-';
        }

        return <BasicTag>{business.name}</BasicTag>;
      }
    }
  ];
