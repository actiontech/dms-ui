import { CustomSelectProps } from '@actiontech/dms-kit';
import { IUserBindProject } from '@actiontech/shared/lib/api/base/service/common';

export type RecentlyProjectsRecordType = Record<
  string,
  Pick<IUserBindProject, 'project_id' | 'project_name'>[]
>;

export type IBindProject = { archived: boolean } & IUserBindProject;

export type ProjectSelectorProps = {
  bindProjects?: IBindProject[];
} & CustomSelectProps;
