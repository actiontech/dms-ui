import { IListMemberRoleWithOpRange } from '@actiontech/shared/lib/api/base/service/common';
import { MemberRoleWithOpRangeOpRangeTypeEnum } from '@actiontech/shared/lib/api/base/service/common.enum';

const formatMemberRole = (members: IListMemberRoleWithOpRange[]) => {
  return members.map((item) => {
    const opRangeTypeInForm: MemberRoleWithOpRangeOpRangeTypeEnum =
      (item?.op_range_type ??
        MemberRoleWithOpRangeOpRangeTypeEnum.unknown) as MemberRoleWithOpRangeOpRangeTypeEnum;
    return {
      op_range_type: opRangeTypeInForm,
      range_uids: (item?.range_uids ?? []).map((range) => range?.uid ?? ''),
      role_uid: item?.role_uid?.uid ?? ''
    };
  });
};

export default formatMemberRole;
