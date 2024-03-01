import { t } from '../../locale';
import { ListMemberRoleWithOpRangeOpRangeTypeEnum } from '@actiontech/shared/lib/api/base/service/common.enum';

const rangeTypeDictionary: Record<
  keyof typeof ListMemberRoleWithOpRangeOpRangeTypeEnum,
  string
> = {
  [ListMemberRoleWithOpRangeOpRangeTypeEnum.global]: t(
    'dmsUserCenter.role.opPermissionList.rangeTypeDictionary.global'
  ),
  [ListMemberRoleWithOpRangeOpRangeTypeEnum.project]: t(
    'dmsUserCenter.role.opPermissionList.rangeTypeDictionary.project'
  ),
  [ListMemberRoleWithOpRangeOpRangeTypeEnum.db_service]: t(
    'dmsUserCenter.role.opPermissionList.rangeTypeDictionary.dbService'
  ),
  [ListMemberRoleWithOpRangeOpRangeTypeEnum.unknown]: t('common.unknown')
};

export const getOpRangeTypeName = (
  opRangeType?: ListMemberRoleWithOpRangeOpRangeTypeEnum
) => {
  if (!opRangeType) return ListMemberRoleWithOpRangeOpRangeTypeEnum.unknown;

  return rangeTypeDictionary[opRangeType];
};
