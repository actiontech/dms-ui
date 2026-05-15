import formatMemberRole from '../formatMemberRole';
import { ListMemberRoleWithOpRangeOpRangeTypeEnum } from '@actiontech/shared/lib/api/base/service/common.enum';

describe('base/Member/Common/formatMemberRole', () => {
  it('should format member role', () => {
    expect(formatMemberRole([])).toEqual([]);
    expect(
      formatMemberRole([
        {
          op_range_type: ListMemberRoleWithOpRangeOpRangeTypeEnum.db_service,
          range_uids: [
            { uid: '701', name: 'Range1' },
            { uid: '702', name: 'Range2' }
          ],
          role_uid: { uid: '5001', name: 'Role1' }
        },
        {
          range_uids: [
            { uid: '703', name: 'Range3' },
            { uid: '704', name: 'Range4' }
          ],
          role_uid: { uid: '5002', name: 'Role1' }
        }
      ])
    ).toEqual([
      {
        op_range_type: ListMemberRoleWithOpRangeOpRangeTypeEnum.db_service,
        range_uids: ['701', '702'],
        role_uid: '5001'
      },
      {
        op_range_type: ListMemberRoleWithOpRangeOpRangeTypeEnum.unknown,
        range_uids: ['703', '704'],
        role_uid: '5002'
      }
    ]);
  });
});
