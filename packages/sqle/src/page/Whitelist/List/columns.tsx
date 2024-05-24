import { t } from '../../../locale';
import { ActiontechTableColumn } from '@actiontech/shared/lib/components/ActiontechTable';
import { WhitelistMatchTypeLabel } from '../Drawer/WhitelistForm';
import { IAuditWhitelistResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { CreateAuditWhitelistReqV1MatchTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { SQLRenderer } from '@actiontech/shared';

export const WhitelistColumn =
  (): ActiontechTableColumn<IAuditWhitelistResV1> => {
    return [
      {
        dataIndex: 'value',
        title: () => t('whitelist.table.sql'),
        width: 600,
        render: (sql?: string) => {
          if (!!sql) {
            return <SQLRenderer.Snippet sql={sql} rows={2} showCopyIcon />;
          }
          return null;
        }
      },
      {
        dataIndex: 'desc',
        title: () => t('whitelist.table.desc')
      },
      {
        dataIndex: 'match_type',
        title: () => t('whitelist.table.matchType'),
        render: (matchType?: CreateAuditWhitelistReqV1MatchTypeEnum) => {
          return matchType ? t(WhitelistMatchTypeLabel[matchType]) : null;
        }
      }
    ];
  };
