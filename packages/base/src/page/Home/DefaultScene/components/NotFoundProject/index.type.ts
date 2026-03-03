import { IUserBindProject } from '@actiontech/shared/lib/api/base/service/common';

export type NotFoundProjectProps = {
  open: boolean;
  setOpen: (v: boolean) => void;
  bindProjects: IUserBindProject[];
  updateRecentlyProject: (id: string, name: string) => void;
  /** 选择项目确认后的自定义跳转：传入则调用并自行跳转，不传则默认跳转到规则页面 */
  onAfterSelectProject?: (projectID: string) => void;
};
