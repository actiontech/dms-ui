import { ActiontechTableColumn } from '@actiontech/dms-kit/es/components/ActiontechTable';
import { t } from '../../../locale';
import { ILicenseItem } from '@actiontech/shared/lib/api/base/service/common';
import { BasicTypographyEllipsis } from '@actiontech/shared';

export const LicenseColumn: ActiontechTableColumn<ILicenseItem> = [
  {
    dataIndex: 'description',
    title: t('dmsSystem.license.table.name')
  },
  {
    dataIndex: 'limit',
    title: t('dmsSystem.license.table.limit'),
    className: 'ellipsis-column-width',
    render: (text = '-', record) => {
      if (record.name === 'info') {
        return (
          <div style={{ width: 350 }}>
            <BasicTypographyEllipsis textCont={text} />
          </div>
        );
      }
      return text;
    }
  }
];
