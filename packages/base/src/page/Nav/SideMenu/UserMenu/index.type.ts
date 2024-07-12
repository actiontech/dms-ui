import { SupportTheme } from '@actiontech/shared/lib/enum';
import { VersionEnum } from './index.enum';

export type UserMenuProps = {
  username: string;
  theme: SupportTheme;
  updateTheme: (theme: SupportTheme) => void;
  isAdmin: boolean;
  isCertainProjectManager: boolean;
};

export type BasicVersionModalProps = {
  open: boolean;
  width?: number | string;
  versions: Array<VersionEnum.DMS | VersionEnum.SQLE>;
  desc: React.ReactNode;
  feature: React.ReactNode;
  setVersionModalClose: () => void;
};
