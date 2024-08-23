import { t } from '../../../locale';
import {
  ActiontechTableColumn,
  PageInfoWithoutIndexAndSize
} from '@actiontech/shared/lib/components/ActiontechTable';
import { WhitelistMatchTypeLabel } from '../index.data';
import { IAuditWhitelistResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { CreateAuditWhitelistReqV1MatchTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { SQLRenderer, BasicTypographyEllipsis } from '@actiontech/shared';
import { IGetAuditWhitelistV1Params } from '@actiontech/shared/lib/api/sqle/service/audit_whitelist/index.d';
import { formatTime } from '@actiontech/shared/lib/utils/Common';

export type WhitelistTableFilterParamType = PageInfoWithoutIndexAndSize<
  IGetAuditWhitelistV1Params & {
    page_index: number;
    page_size: number;
  },
  'project_name'
>;

export const WhitelistColumn = (): ActiontechTableColumn<
  IAuditWhitelistResV1,
  WhitelistTableFilterParamType
> => {
  return [
    {
      dataIndex: 'value',
      title: () => t('whitelist.table.sql'),
      className: 'ellipsis-column-width',
      render: (sql) => {
        if (!!sql) {
          return (
            <SQLRenderer.Snippet
              sql={sql}
              rows={2}
              showCopyIcon
              cuttingLength={200}
            />
          );
        }
        return null;
      }
    },
    {
      dataIndex: 'desc',
      title: () => t('whitelist.table.desc'),
      className: 'ellipsis-column-width',
      render: (desc) => {
        if (!desc) return '-';
        return <BasicTypographyEllipsis textCont={desc} />;
      }
    },
    {
      dataIndex: 'match_type',
      title: () => t('whitelist.table.matchType'),
      render: (matchType) => {
        return matchType
          ? WhitelistMatchTypeLabel[
              matchType as CreateAuditWhitelistReqV1MatchTypeEnum
            ]
          : null;
      },
      filterCustomType: 'select',
      filterKey: 'filter_match_type'
    },
    {
      dataIndex: 'matched_count',
      title: () => t('whitelist.table.matchCount')
    },
    {
      dataIndex: 'last_match_time',
      title: () => t('sqlManagementException.table.lastMatchedTime'),
      render: (value) => {
        return formatTime(value, '-');
      }
    }
  ];
};
