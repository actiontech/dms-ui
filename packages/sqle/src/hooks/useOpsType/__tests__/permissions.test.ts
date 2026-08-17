import {
  canMaintainOpsTypeDictionary,
  resolveOpsTypeEditableSelectPermissions,
  OPS_TYPE_EDITABLE_PERMISSIONS_ON,
  OPS_TYPE_EDITABLE_PERMISSIONS_OFF
} from '../permissions';

describe('sqle/hooks/useOpsType/permissions', () => {
  it('project manager → addable/updatable/deletable all on', () => {
    expect(
      resolveOpsTypeEditableSelectPermissions({
        isAdmin: false,
        isProjectManager: true
      })
    ).toEqual(OPS_TYPE_EDITABLE_PERMISSIONS_ON);
    expect(
      canMaintainOpsTypeDictionary({
        isAdmin: false,
        isProjectManager: true
      })
    ).toBe(true);
  });

  it('platform admin → all on for any project (isProjectManager false)', () => {
    expect(
      resolveOpsTypeEditableSelectPermissions({
        isAdmin: true,
        isProjectManager: false
      })
    ).toEqual(OPS_TYPE_EDITABLE_PERMISSIONS_ON);
    expect(
      canMaintainOpsTypeDictionary({
        isAdmin: true,
        isProjectManager: false
      })
    ).toBe(true);
  });

  it('regular member → all off (select only, no add/update/delete entry)', () => {
    const perms = resolveOpsTypeEditableSelectPermissions({
      isAdmin: false,
      isProjectManager: false
    });
    expect(perms).toEqual(OPS_TYPE_EDITABLE_PERMISSIONS_OFF);
    expect(perms.addable).toBe(false);
    expect(perms.updatable).toBe(false);
    expect(perms.deletable).toBe(false);
    expect(
      canMaintainOpsTypeDictionary({
        isAdmin: false,
        isProjectManager: false
      })
    ).toBe(false);
  });

  it('platform admin + project manager still all on', () => {
    expect(
      resolveOpsTypeEditableSelectPermissions({
        isAdmin: true,
        isProjectManager: true
      })
    ).toEqual(OPS_TYPE_EDITABLE_PERMISSIONS_ON);
  });
});
