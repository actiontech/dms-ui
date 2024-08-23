import { CreateAuditWhitelistReqV1MatchTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { t } from '../../locale';

export const WhitelistMatchTypeLabel: {
  [key in CreateAuditWhitelistReqV1MatchTypeEnum]: string;
} = {
  [CreateAuditWhitelistReqV1MatchTypeEnum.fp_match]: t(
    'whitelist.matchType.fingerPrint'
  ),
  [CreateAuditWhitelistReqV1MatchTypeEnum.exact_match]: t(
    'whitelist.matchType.exact'
  )
};

export const whitelistMatchTypeOptions: Array<{
  label: string;
  value: CreateAuditWhitelistReqV1MatchTypeEnum;
}> = [
  {
    label:
      WhitelistMatchTypeLabel[
        CreateAuditWhitelistReqV1MatchTypeEnum.exact_match
      ],
    value: CreateAuditWhitelistReqV1MatchTypeEnum.exact_match
  },
  {
    label:
      WhitelistMatchTypeLabel[CreateAuditWhitelistReqV1MatchTypeEnum.fp_match],
    value: CreateAuditWhitelistReqV1MatchTypeEnum.fp_match
  }
];
