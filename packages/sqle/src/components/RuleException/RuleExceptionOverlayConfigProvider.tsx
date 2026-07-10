import { ConfigProvider } from 'antd';
import { useMemo } from 'react';
import {
  getRuleExceptionOverlayPopupTheme,
  RULE_EXCEPTION_OVERLAY_DRAWER_Z_INDEX
} from './drawerZIndex';

type RuleExceptionOverlayConfigProviderProps = {
  drawerZIndex?: number;
  children: React.ReactNode;
};

const RuleExceptionOverlayConfigProvider: React.FC<
  RuleExceptionOverlayConfigProviderProps
> = ({ drawerZIndex = RULE_EXCEPTION_OVERLAY_DRAWER_Z_INDEX, children }) => {
  const theme = useMemo(
    () => getRuleExceptionOverlayPopupTheme(drawerZIndex),
    [drawerZIndex]
  );

  return <ConfigProvider theme={theme}>{children}</ConfigProvider>;
};

export default RuleExceptionOverlayConfigProvider;
