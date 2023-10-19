import { ILicenseItem } from '@actiontech/shared/lib/api/sqle/service/common';
import { ActiontechTableColumn } from '@actiontech/shared/lib/components/ActiontechTable';
import { t } from '../../../locale';

export const LicenseColumn: ActiontechTableColumn<ILicenseItem> = [
  {
    dataIndex: 'description',
    title: t('system.license.table.name')
  },
  {
    dataIndex: 'limit',
    title: t('system.license.table.limit'),
    render: (text) => {
      return (
        <span
          style={{
            wordBreak: 'break-all'
          }}
        >
          {text}
        </span>
      );
    }
  }
];
