import { SupportLanguage, SupportTheme } from '@actiontech/shared/lib/enum';
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
  versions: Array<VersionEnum.DMS | VersionEnum.SQLE | VersionEnum.PROVISION>;
  desc: React.ReactNode;
  feature: React.ReactNode;
  setVersionModalClose: () => void;
};
