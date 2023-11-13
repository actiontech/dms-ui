import { IUserBindProject } from '@actiontech/shared/lib/api/base/service/common';
import { CustomSelectProps } from '@actiontech/shared/lib/components/CustomSelect';

export type RecentlyProjectsRecordType = Record<
  string,
  Pick<IUserBindProject, 'project_id' | 'project_name'>[]
>;

export type ProjectSelectorProps = {
  bindProjects?: IUserBindProject[];
} & CustomSelectProps;
