import { t } from '../../../locale';
import {
  ActiontechTableColumn,
  ActiontechTableProps
} from '@actiontech/dms-kit/es/components/ActiontechTable';
import { BasicTag, formatTime } from '@actiontech/dms-kit';
import { IAccessWhitelistRuleItem } from '@actiontech/shared/lib/api/base/service/common';

export const AccessSettingColumns =
  (): ActiontechTableColumn<IAccessWhitelistRuleItem> => [
    {
      dataIndex: 'source',
      title: t('dmsSystem.accessSettings.columns.source')
    },
    {
      dataIndex: 'policy_type',
      title: t('dmsSystem.accessSettings.columns.policy'),
      render: () => (
        <BasicTag color="green">
          {t('dmsSystem.accessSettings.whitelistPolicy')}
        </BasicTag>
      )
    },
    {
      dataIndex: 'remark',
      title: t('dmsSystem.accessSettings.columns.remark'),
      render: (text) => text || '-'
    },
    {
      dataIndex: 'updated_at',
      title: t('dmsSystem.accessSettings.columns.updatedAt'),
      render: (time) => formatTime(time, '-')
    }
  ];

export type AccessSettingTableActions =
  ActiontechTableProps<IAccessWhitelistRuleItem>['actions'];
