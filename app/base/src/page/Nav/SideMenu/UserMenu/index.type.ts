import { SupportLanguage, SupportTheme } from '@actiontech/dms-kit';
import { VersionEnum } from './index.enum';

export type UserMenuProps = {
  username: string;
  language: SupportLanguage;
  theme: SupportTheme;
  updateTheme: (theme: SupportTheme) => void;
};

export type BasicVersionModalProps = {
  open: boolean;
  width?: number | string;
  versions: Array<VersionEnum.DMS | VersionEnum.SQLE>;
  desc: React.ReactNode;
  feature: React.ReactNode;
  setVersionModalClose: () => void;
};
