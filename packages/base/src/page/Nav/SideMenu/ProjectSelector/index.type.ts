import { IUserBindProject } from '@actiontech/shared/lib/api/base/service/common';

export type RecentlyProjectsRecordType = Record<
  string,
  Pick<IUserBindProject, 'project_id' | 'project_name'>[]
>;
