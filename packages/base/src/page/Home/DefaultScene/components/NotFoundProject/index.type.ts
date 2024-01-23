import { IUserBindProject } from '@actiontech/shared/lib/api/base/service/common';

export type NotFoundProjectProps = {
  open: boolean;
  setOpen: (v: boolean) => void;
  bindProjects: IUserBindProject[];
  updateRecentlyProject: (id: string, name: string) => void;
};
