import { SystemRole } from '@actiontech/dms-kit';
import { PERMISSION_MANIFEST } from '../../usePermission/permissionManifest';
import { PERMISSIONS } from '../../usePermission/permissions';

describe('project director enum removal', () => {
  it('should not have projectDirector in SystemRole enum', () => {
    const roleValues = Object.values(SystemRole);
    expect(roleValues).not.toContain('projectDirector');
    expect(roleValues).not.toContain('project_director');
    expect(
      (SystemRole as Record<string, string>).projectDirector
    ).toBeUndefined();
  });

  it('should not have projectDirector in PROJECT_MANAGER permission manifest roles', () => {
    const importManifest =
      PERMISSION_MANIFEST[PERMISSIONS.ACTIONS.BASE.PROJECT_MANAGER.IMPORT];
    const exportManifest =
      PERMISSION_MANIFEST[PERMISSIONS.ACTIONS.BASE.PROJECT_MANAGER.EXPORT];
    const createManifest =
      PERMISSION_MANIFEST[PERMISSIONS.ACTIONS.BASE.PROJECT_MANAGER.CREATE];

    expect(importManifest.role).not.toContain('projectDirector');
    expect(exportManifest.role).not.toContain('projectDirector');
    expect(createManifest.role).not.toContain('projectDirector');

    // Verify only admin and systemAdministrator remain
    expect(importManifest.role).toEqual([
      SystemRole.admin,
      SystemRole.systemAdministrator
    ]);
    expect(exportManifest.role).toEqual([
      SystemRole.admin,
      SystemRole.systemAdministrator
    ]);
    expect(createManifest.role).toEqual([
      SystemRole.admin,
      SystemRole.systemAdministrator
    ]);
  });
});
