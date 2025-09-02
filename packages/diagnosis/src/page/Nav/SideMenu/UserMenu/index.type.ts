import { SupportTheme } from '@actiontech/shared/lib/enum';

export type UserMenuProps = {
  username: string;
  theme: SupportTheme;
  updateTheme: (theme: SupportTheme) => void;
};
